import { firebaseGet } from "./firebase-rest";

export const ownerSettingsPath = "ownerSettings";
export const suspendedAccountNotice = "Your account has been suspend. Please contact support.";

type AccountAccessRecord = {
  role?: string;
  suspended?: boolean;
};

type OwnerSettingsRecord = {
  supportLink?: string;
};

export function safeSupportLink(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export async function getOwnerSupportLink(): Promise<string> {
  const settings = await firebaseGet<OwnerSettingsRecord | null>(ownerSettingsPath);
  return safeSupportLink(settings?.supportLink);
}

export async function getSuspendedAccountSupport(userId: string): Promise<{ supportLink: string } | null> {
  const account = await firebaseGet<AccountAccessRecord | null>(`accounts/${encodeURIComponent(userId)}`);
  if (account?.role === "owner" || account?.suspended !== true) return null;
  return { supportLink: await getOwnerSupportLink() };
}