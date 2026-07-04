import { apiClient } from "./client";
import type { Itinerary, PaginatedResponse } from "../types";

export const itineraryApi = {
  list: (params?: { page?: number; limit?: number }) =>
    apiClient
      .get<PaginatedResponse<Itinerary>>("/itineraries", { params })
      .then((r: any) => r.data),

  get: (id: string) =>
    apiClient
      .get<{ itinerary: Itinerary }>(`/itineraries/${id}`)
      .then((r: any) => r.data.itinerary),

  create: (data: {
    title: string;
    description?: string;
    category?: string;
    trips?: string[];
    sharedWith?: string[];
    visibility?: string;
  }) =>
    apiClient
      .post<{ itinerary: Itinerary }>("/itineraries", data)
      .then((r: any) => r.data.itinerary),

  update: (id: string, data: Partial<Itinerary>) =>
    apiClient
      .put<{ itinerary: Itinerary }>(`/itineraries/${id}`, data)
      .then((r: any) => r.data.itinerary),

  delete: (id: string) =>
    apiClient.delete(`/itineraries/${id}`).then((r: any) => r.data),
};
