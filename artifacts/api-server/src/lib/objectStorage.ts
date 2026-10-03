import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { Storage, type File } from "@google-cloud/storage";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

export const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
  }
}

export class ObjectStorageService {
  private getPrivateObjectDir(): string {
    const value = process.env.PRIVATE_OBJECT_DIR?.trim();
    if (!value) throw new Error("PRIVATE_OBJECT_DIR is not configured.");
    return value.replace(/\/+$/, "");
  }

  async getProfileImageUploadURL(ownerId: string, extension: string): Promise<{ uploadURL: string; objectPath: string }> {
    const objectName = `profile-images/${ownerId}/${randomUUID()}.${extension}`;
    const fullPath = `${this.getPrivateObjectDir()}/${objectName}`;
    const { bucketName, objectName: bucketObjectName } = parseObjectPath(fullPath);
    const uploadURL = await signObjectURL({
      bucketName,
      objectName: bucketObjectName,
      method: "PUT",
      ttlSec: 900,
    });
    return { uploadURL, objectPath: `/objects/${objectName}` };
  }

  async getPaymentAssetUploadURL(
    ownerId: string,
    kind: "proof" | "qr",
    extension: string,
  ): Promise<{ uploadURL: string; objectPath: string }> {
    const objectName = kind === "proof"
      ? `payment-proof/${encodeURIComponent(ownerId)}/${randomUUID()}.${extension}`
      : `payment-qr/${randomUUID()}.${extension}`;
    const fullPath = `${this.getPrivateObjectDir()}/${objectName}`;
    const { bucketName, objectName: bucketObjectName } = parseObjectPath(fullPath);
    const uploadURL = await signObjectURL({
      bucketName,
      objectName: bucketObjectName,
      method: "PUT",
      ttlSec: 900,
    });
    return { uploadURL, objectPath: `/objects/${objectName}` };
  }

  async getObjectEntityFile(objectPath: string): Promise<File> {
    if (!objectPath.startsWith("/objects/")) throw new ObjectNotFoundError();
    const entityId = objectPath.slice("/objects/".length);
    if (!entityId || entityId.includes("..")) throw new ObjectNotFoundError();
    const fullPath = `${this.getPrivateObjectDir()}/${entityId}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    const file = objectStorageClient.bucket(bucketName).file(objectName);
    const [exists] = await file.exists();
    if (!exists) throw new ObjectNotFoundError();
    return file;
  }

  async getSignedDownloadURL(objectPath: string, ttlSec = 900): Promise<string> {
    await this.getObjectEntityFile(objectPath);
    const fullPath = `${this.getPrivateObjectDir()}/${objectPath.slice("/objects/".length)}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    return signObjectURL({ bucketName, objectName, method: "GET", ttlSec });
  }

  async downloadObject(file: File): Promise<Response> {
    const [metadata] = await file.getMetadata();
    const nodeStream = file.createReadStream();
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;
    const headers: Record<string, string> = {
      "Content-Type": String(metadata.contentType || "application/octet-stream"),
      "Cache-Control": "private, max-age=3600",
    };
    if (metadata.size) headers["Content-Length"] = String(metadata.size);
    return new Response(webStream, { headers });
  }
}

function parseObjectPath(path: string): { bucketName: string; objectName: string } {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const parts = normalized.split("/");
  if (parts.length < 3 || !parts[1] || !parts.slice(2).join("/")) throw new Error("Invalid object path.");
  return { bucketName: parts[1], objectName: parts.slice(2).join("/") };
}

async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec,
}: {
  bucketName: string;
  objectName: string;
  method: "PUT" | "GET";
  ttlSec: number;
}): Promise<string> {
  const response = await fetch(`${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bucket_name: bucketName,
      object_name: objectName,
      method,
      expires_at: new Date(Date.now() + ttlSec * 1000).toISOString(),
    }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`Failed to sign object URL: ${response.status}`);
  const payload = await response.json() as { signed_url?: string };
  if (!payload.signed_url) throw new Error("Object storage did not return a signed URL.");
  return payload.signed_url;
}