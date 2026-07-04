import { apiClient } from "./client";
import type { DiscoveryInput, DiscoveryResult } from "../types";

export const discoveryApi = {
  discover: (data: DiscoveryInput) =>
    apiClient
      .post<DiscoveryResult>("/discover", data)
      .then((r: any) => r.data),

  enhanceTrip: (data: {
    location: string;
    interests?: string[];
    existingDestinations?: Array<{ name: string }>;
  }) =>
    apiClient
      .post<{
        additionalDestinations: Array<{ name: string; whySpecial: string; tip: string }>;
        uniqueExperiences: Array<{ name: string; whySpecial: string; tip: string }>;
      }>("/ai/enhance-trip", data)
      .then((r: any) => r.data),
};
