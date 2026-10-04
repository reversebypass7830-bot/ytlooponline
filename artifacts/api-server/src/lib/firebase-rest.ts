type FirebaseRequestInit = {
  method?: "GET" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

function databaseUrl(): string {
  const value = process.env.FIREBASE_DATABASE_URL?.trim();
  if (!value) throw new Error("FIREBASE_DATABASE_URL is not configured.");
  return value.replace(/\/+$/, "");
}

export async function firebaseRequest<T>(path: string, init: FirebaseRequestInit = {}): Promise<T> {
  const response = await fetch(`${databaseUrl()}/${path.replace(/^\/+/, "")}.json`, {
    method: init.method ?? "GET",
    headers: init.body === undefined ? undefined : { "content-type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  return parseFirebaseResponse<T>(response);
}

async function parseFirebaseResponse<T>(response: Response): Promise<T> {
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
    const message = typeof payload === "object" && payload && "error" in payload
      ? String((payload as { error: unknown }).error)
      : `Firebase request failed with status ${response.status}.`;
    throw new Error(message);
  }
  return payload as T;
}

export const firebaseGet = <T>(path: string) => firebaseRequest<T>(path);
export const firebasePut = <T>(path: string, body: unknown) => firebaseRequest<T>(path, { method: "PUT", body });
export const firebaseDelete = <T>(path: string) => firebaseRequest<T>(path, { method: "DELETE" });

export async function firebaseGetWithEtag<T>(path: string): Promise<{ value: T; etag: string }> {
  const response = await fetch(`${databaseUrl()}/${path.replace(/^\/+/, "")}.json`, {
    headers: { "X-Firebase-ETag": "true" },
  });
  const value = await parseFirebaseResponse<T>(response);
  const etag = response.headers.get("etag");
  if (!etag) throw new Error("Firebase did not return an ETag for the account record.");
  return { value, etag };
}

export async function firebasePutIfMatch<T>(path: string, body: unknown, etag: string): Promise<boolean> {
  const response = await fetch(`${databaseUrl()}/${path.replace(/^\/+/, "")}.json`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "if-match": etag,
    },
    body: JSON.stringify(body),
  });
  if (response.status === 412) return false;
  await parseFirebaseResponse<T>(response);
  return true;
}
