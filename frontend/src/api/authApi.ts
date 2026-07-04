import { apiClient } from "./client";
import type { AuthResponse, User } from "../types";

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post<AuthResponse>("/auth/register", data).then((r: any) => r.data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>("/auth/login", data).then((r: any) => r.data),

  logout: () => apiClient.post("/auth/logout").then((r: any) => r.data),

  refresh: () =>
    apiClient.post<{ accessToken: string }>("/auth/refresh").then((r: any) => r.data),

  getMe: () => apiClient.get<{ user: User }>("/auth/me").then((r: any) => r.data.user),
};
