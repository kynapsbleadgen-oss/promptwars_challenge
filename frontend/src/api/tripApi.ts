import { apiClient } from "./client";
import type { Trip, PaginatedResponse } from "../types";

export interface TripFilters {
  page?: number;
  limit?: number;
  sort?: string;
  status?: string;
  search?: string;
}

export const tripApi = {
  list: (params?: TripFilters) =>
    apiClient
      .get<PaginatedResponse<Trip>>("/trips", { params })
      .then((r: any) => r.data),

  get: (id: string) =>
    apiClient.get<{ trip: Trip }>(`/trips/${id}`).then((r: any) => r.data.trip),

  create: (data: Partial<Trip>) =>
    apiClient.post<{ trip: Trip }>("/trips", data).then((r: any) => r.data.trip),

  update: (id: string, data: Partial<Trip>) =>
    apiClient
      .put<{ trip: Trip }>(`/trips/${id}`, data)
      .then((r: any) => r.data.trip),

  delete: (id: string) => apiClient.delete(`/trips/${id}`).then((r: any) => r.data),
};
