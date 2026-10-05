import { firebaseGet } from "./firebase-rest";

export const ownerSettingsPath = "ownerSettings";
export const suspendedAccountNotice = "Your account has been suspend. Please contact support.";
export const defaultMaintenanceMessage = "We’re carrying out scheduled maintenance to improve your experience. Please check back soon.";
export const defaultMaintenanceLinkLabel = "Get Updates";

type AccountAccessRecord = {
  role?: string;
  suspended?: boolean;
};

type OwnerSettingsRecord = {
  supportLink?: string;
  maintenanceEnabled?: boolean;
  maintenanceMessage?: string;
  maintenanceLinkUrl?: string;
  maintenanceLinkLabel?: string;
};

export type OwnerSettings = {
  supportLink: string;
  maintenanceEnabled: boolean;
  maintenanceMessage: string;
  maintenanceLinkUrl: string;
  maintenanceLinkLabel: string;
};

export function safeHttpLink(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export const safeSupportLink = safeHttpLink;

export async function getOwnerSettings(): Promise<OwnerSettings> {
  const settings = await firebaseGet<OwnerSettingsRecord | null>(ownerSettingsPath);
  return {
    supportLink: safeHttpLink(settings?.supportLink),
    maintenanceEnabled: settings?.maintenanceEnabled === true,
    maintenanceMessage: typeof settings?.maintenanceMessage === "string"
      ? settings.maintenanceMessage.slice(0, 500)
      : "",
    maintenanceLinkUrl: safeHttpLink(settings?.maintenanceLinkUrl),
    maintenanceLinkLabel: typeof settings?.maintenanceLinkLabel === "string"
      ? settings.maintenanceLinkLabel.trim().slice(0, 60)
      : "",
  };
}

export async function getOwnerSupportLink(): Promise<string> {
  return (await getOwnerSettings()).supportLink;
}

export async function getPublicMaintenance(): Promise<{
  enabled: boolean;
  message: string;
  linkUrl: string;
  linkLabel: string;
}> {
  const settings = await getOwnerSettings();
  return {
    enabled: settings.maintenanceEnabled,
    message: settings.maintenanceMessage.trim() || defaultMaintenanceMessage,
    linkUrl: settings.maintenanceLinkUrl,
    linkLabel: settings.maintenanceLinkLabel || defaultMaintenanceLinkLabel,
  };
}

export async function getSuspendedAccountSupport(userId: string): Promise<{ supportLink: string } | null> {
  const account = await firebaseGet<AccountAccessRecord | null>(`accounts/${encodeURIComponent(userId)}`);
  if (account?.role === "owner" || account?.suspended !== true) return null;
  return { supportLink: await getOwnerSupportLink() };
}