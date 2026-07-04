import { apiClient } from "./client";
import type { User, PaginatedResponse } from "../types";

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

export const userApi = {
  // Admin: list all users
  list: (params?: UserFilters) =>
    apiClient
      .get<PaginatedResponse<User>>("/users", { params })
      .then((r: any) => r.data),

  get: (id: string) =>
    apiClient.get<{ user: User }>(`/users/${id}`).then((r: any) => r.data.user),

  update: (
    id: string,
    data: Partial<Pick<User, "name" | "bio" | "avatar" | "role">>,
  ) =>
    apiClient
      .put<{ user: User }>(`/users/${id}`, data)
      .then((r: any) => r.data.user),

  delete: (id: string) => apiClient.delete(`/users/${id}`).then((r: any) => r.data),
};
