import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends the httpOnly refresh-token cookie
  headers: { "Content-Type": "application/json" },
  timeout: 40_000, // 40s — generous for AI endpoints
});

// ─── Access token injection ───────────────────────────────────────────────────

let _accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function getAccessToken() {
  return _accessToken;
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (_accessToken) {
    config.headers.Authorization = `Bearer ${_accessToken}`;
  }
  return config;
});

// ─── Refresh-on-401 ───────────────────────────────────────────────────────────

let _isRefreshing = false;
let _refreshQueue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  _refreshQueue.forEach((cb) => cb(token));
  _refreshQueue = [];
}

apiClient.interceptors.response.use(
  (res: import("axios").AxiosResponse) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Skip refresh for auth endpoints to avoid loops.
    const isAuthEndpoint = original?.url?.startsWith("/auth");

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      if (_isRefreshing) {
        // Queue the request until refresh completes.
        return new Promise((resolve, reject) => {
          _refreshQueue.push((token) => {
            if (token) {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(original));
            } else {
              reject(error);
            }
          });
        });
      }

      original._retry = true;
      _isRefreshing = true;

      try {
        const { data } = await apiClient.post<{ accessToken: string }>(
          "/auth/refresh",
        );
        const newToken = data.accessToken;
        setAccessToken(newToken);
        processQueue(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch {
        setAccessToken(null);
        processQueue(null);
        // Let consumers (AuthContext) handle the redirect to /login.
        return Promise.reject(error);
      } finally {
        _isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

/** Extract a human-readable message from any Axios error. */
export function extractErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (!err || typeof err !== "object") return fallback;
  const axiosErr = err as AxiosError<{ error?: { message?: string } }>;
  return (
    axiosErr.response?.data?.error?.message ??
    axiosErr.message ??
    fallback
  );
}
