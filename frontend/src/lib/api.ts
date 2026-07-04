const API_BASE = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "http://localhost:5000/api";

let accessToken: string | null = null;

export function setToken(token: string | null) {
  accessToken = token;
}

export function getToken() {
  return accessToken;
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    accessToken = data.accessToken;
    return accessToken;
  } catch {
    return null;
  }
}

export async function api<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (accessToken) {
    reqHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  // If 401 and we have/had a token, try refreshing once.
  if (res.status === 401 && accessToken) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      reqHeaders["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: reqHeaders,
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
      });
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(errorData.error?.message || `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}
