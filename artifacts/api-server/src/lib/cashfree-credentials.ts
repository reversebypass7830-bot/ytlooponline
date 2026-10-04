import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";
import { firebaseGet, firebasePut } from "./firebase-rest";
import {
  getCashfreeConfig,
  type CashfreeConfig,
  type CashfreeEnvironment,
} from "./cashfree";

type CashfreeCredentials = {
  clientId: string;
  clientSecret: string;
};

type EncryptedCredentials = {
  version: 1;
  iv: string;
  authTag: string;
  ciphertext: string;
};

const credentialPath = (environment: CashfreeEnvironment) =>
  `billing/cashfreeCredentials/${environment}`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function encryptionKey(): Buffer {
  const sessionSecret = process.env.SESSION_SECRET?.trim();
  if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be configured to store Cashfree credentials securely.");
  }
  return createHmac("sha256", sessionSecret)
    .update("live-control-room:cashfree-owner-credentials:v1", "utf8")
    .digest();
}

function encryptCredentials(credentials: CashfreeCredentials): EncryptedCredentials {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(credentials), "utf8"),
    cipher.final(),
  ]);
  return {
    version: 1,
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  };
}

function decodeBase64(value: string, expectedLength?: number): Buffer | null {
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) return null;
  const decoded = Buffer.from(value, "base64");
  if (decoded.toString("base64") !== value) return null;
  if (expectedLength !== undefined && decoded.length !== expectedLength) return null;
  return decoded;
}

function decryptCredentials(value: unknown): CashfreeCredentials {
  if (!isRecord(value)
    || value.version !== 1
    || typeof value.iv !== "string"
    || typeof value.authTag !== "string"
    || typeof value.ciphertext !== "string") {
    throw new Error("Stored Cashfree credentials are invalid.");
  }
  const iv = decodeBase64(value.iv, 12);
  const authTag = decodeBase64(value.authTag, 16);
  const ciphertext = decodeBase64(value.ciphertext);
  if (!iv || !authTag || !ciphertext || ciphertext.length === 0) {
    throw new Error("Stored Cashfree credentials are invalid.");
  }
  try {
    const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
    decipher.setAuthTag(authTag);
    const cleartext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString("utf8");
    const parsed: unknown = JSON.parse(cleartext);
    if (!isRecord(parsed)
      || typeof parsed.clientId !== "string"
      || typeof parsed.clientSecret !== "string"
      || !parsed.clientId
      || !parsed.clientSecret) {
      throw new Error("Stored Cashfree credentials are invalid.");
    }
    return { clientId: parsed.clientId, clientSecret: parsed.clientSecret };
  } catch {
    throw new Error("Cashfree credentials could not be decrypted. Check that SESSION_SECRET has not changed.");
  }
}

export async function saveOwnerCashfreeCredentials(
  environment: CashfreeEnvironment,
  credentials: CashfreeCredentials,
): Promise<void> {
  const clientId = credentials.clientId.trim();
  const clientSecret = credentials.clientSecret.trim();
  if (!clientId || !clientSecret) throw new Error("Both Cashfree credentials are required.");
  const encrypted = encryptCredentials({ clientId, clientSecret });
  await firebasePut(credentialPath(environment), encrypted);
}

async function loadOwnerCashfreeCredentials(
  environment: CashfreeEnvironment,
): Promise<CashfreeCredentials | null> {
  const encrypted = await firebaseGet<EncryptedCredentials | null>(credentialPath(environment));
  return encrypted ? decryptCredentials(encrypted) : null;
}

export async function getCashfreeConfigForEnvironment(
  environment: CashfreeEnvironment,
): Promise<CashfreeConfig | null> {
  const credentials = await loadOwnerCashfreeCredentials(environment);
  if (!credentials) return getCashfreeConfig(environment);
  return {
    environment,
    ...credentials,
    apiBaseUrl: environment === "sandbox"
      ? "https://sandbox.cashfree.com/pg"
      : "https://api.cashfree.com/pg",
  };
}