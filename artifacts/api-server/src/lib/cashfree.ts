import { createHmac, timingSafeEqual } from "node:crypto";

export type CashfreeEnvironment = "sandbox" | "production";

export type CashfreeConfig = {
  environment: CashfreeEnvironment;
  clientId: string;
  clientSecret: string;
  apiBaseUrl: string;
};

export type CashfreeOrderData = {
  orderId: string;
  orderStatus: string;
  orderAmountPaise: number;
  orderCurrency: string;
  paymentSessionId?: string;
};

export type CashfreePaymentData = {
  paymentId: string;
  paymentStatus: string;
  amountPaise: number;
  currency: string;
};

const apiVersion = "2026-01-01";

function envPrefix(environment: CashfreeEnvironment): string {
  return environment === "sandbox" ? "CASHFREE_SANDBOX" : "CASHFREE_PRODUCTION";
}

export function getCashfreeConfig(environment: CashfreeEnvironment): CashfreeConfig | null {
  const prefix = envPrefix(environment);
  const clientId = process.env[`${prefix}_CLIENT_ID`]?.trim();
  const clientSecret = process.env[`${prefix}_CLIENT_SECRET`]?.trim();
  if (!clientId || !clientSecret) return null;
  return {
    environment,
    clientId,
    clientSecret,
    apiBaseUrl: environment === "sandbox" ? "https://sandbox.cashfree.com/pg" : "https://api.cashfree.com/pg",
  };
}

export function isCashfreeConfigured(environment: CashfreeEnvironment): boolean {
  return getCashfreeConfig(environment) !== null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function amountToPaise(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return null;
  const paise = Math.round(value * 100);
  return Number.isSafeInteger(paise) ? paise : null;
}

async function requestCashfree(
  config: CashfreeConfig,
  path: string,
  options: { method: "GET" | "POST"; body?: unknown; idempotencyKey?: string },
): Promise<unknown> {
  const headers: Record<string, string> = {
    accept: "application/json",
    "x-api-version": apiVersion,
    "x-client-id": config.clientId,
    "x-client-secret": config.clientSecret,
  };
  if (options.body !== undefined) headers["content-type"] = "application/json";
  if (options.idempotencyKey) headers["x-idempotency-key"] = options.idempotencyKey;

  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method: options.method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: AbortSignal.timeout(15_000),
  });
  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }
  if (!response.ok) {
    throw new Error(`Cashfree API request failed with HTTP ${response.status}.`);
  }
  return payload;
}

export async function createCashfreeOrder(
  config: CashfreeConfig,
  input: {
    orderId: string;
    amountPaise: number;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    returnUrl: string;
    notifyUrl: string;
    note: string;
    idempotencyKey: string;
  },
): Promise<CashfreeOrderData> {
  const payload = await requestCashfree(config, "/orders", {
    method: "POST",
    idempotencyKey: input.idempotencyKey,
    body: {
      order_id: input.orderId,
      order_amount: input.amountPaise / 100,
      order_currency: "INR",
      customer_details: {
        customer_id: input.customerId,
        customer_name: input.customerName,
        customer_email: input.customerEmail,
        customer_phone: input.customerPhone,
      },
      order_meta: {
        return_url: input.returnUrl,
        notify_url: input.notifyUrl,
      },
      order_note: input.note.slice(0, 250),
    },
  });
  if (!isRecord(payload)) throw new Error("Cashfree returned an invalid order response.");
  const orderId = typeof payload.order_id === "string" ? payload.order_id : "";
  const paymentSessionId = typeof payload.payment_session_id === "string" ? payload.payment_session_id : "";
  const orderAmountPaise = amountToPaise(payload.order_amount);
  const orderCurrency = typeof payload.order_currency === "string" ? payload.order_currency : "";
  const orderStatus = typeof payload.order_status === "string" ? payload.order_status : "";
  if (!orderId || !paymentSessionId || orderAmountPaise === null || !orderCurrency || !orderStatus) {
    throw new Error("Cashfree returned incomplete order details.");
  }
  return { orderId, paymentSessionId, orderAmountPaise, orderCurrency, orderStatus };
}

export async function fetchCashfreeOrder(
  config: CashfreeConfig,
  orderId: string,
): Promise<CashfreeOrderData> {
  const payload = await requestCashfree(config, `/orders/${encodeURIComponent(orderId)}`, { method: "GET" });
  if (!isRecord(payload)) throw new Error("Cashfree returned an invalid order status.");
  const returnedOrderId = typeof payload.order_id === "string" ? payload.order_id : "";
  const orderAmountPaise = amountToPaise(payload.order_amount);
  const orderCurrency = typeof payload.order_currency === "string" ? payload.order_currency : "";
  const orderStatus = typeof payload.order_status === "string" ? payload.order_status : "";
  if (!returnedOrderId || orderAmountPaise === null || !orderCurrency || !orderStatus) {
    throw new Error("Cashfree returned incomplete order status.");
  }
  return { orderId: returnedOrderId, orderAmountPaise, orderCurrency, orderStatus };
}

export async function fetchCashfreePayments(
  config: CashfreeConfig,
  orderId: string,
): Promise<CashfreePaymentData[]> {
  const payload = await requestCashfree(
    config,
    `/orders/${encodeURIComponent(orderId)}/payments`,
    { method: "GET" },
  );
  if (!Array.isArray(payload)) throw new Error("Cashfree returned an invalid payment list.");
  return payload.flatMap((item) => {
    if (!isRecord(item)) return [];
    const paymentId = typeof item.cf_payment_id === "string" || typeof item.cf_payment_id === "number"
      ? String(item.cf_payment_id)
      : "";
    const paymentStatus = typeof item.payment_status === "string" ? item.payment_status : "";
    const amountPaise = amountToPaise(item.payment_amount);
    const currency = typeof item.payment_currency === "string" ? item.payment_currency : "";
    if (!paymentId || !paymentStatus || amountPaise === null || !currency) return [];
    return [{ paymentId, paymentStatus, amountPaise, currency }];
  });
}

export function verifyCashfreeWebhookSignature(
  config: CashfreeConfig,
  signature: string,
  timestamp: string,
  rawBody: string,
): boolean {
  if (!signature || !timestamp || !rawBody) return false;
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(signature)) return false;
  const expected = createHmac("sha256", config.clientSecret)
    .update(timestamp + rawBody, "utf8")
    .digest();
  let received: Buffer;
  try {
    received = Buffer.from(signature, "base64");
  } catch {
    return false;
  }
  if (received.toString("base64") !== signature) return false;
  return received.length === expected.length && timingSafeEqual(received, expected);
}