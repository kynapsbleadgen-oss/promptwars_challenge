import { apiClient } from "./client";
import type { DashboardStats, AiLog, Pagination } from "../types";

export const analyticsApi = {
  getDashboard: () =>
    apiClient.get<DashboardStats>("/analytics/dashboard").then((r: any) => r.data),

  getAiLogs: (params?: { page?: number; limit?: number; success?: boolean }) =>
    apiClient
      .get<{ items: AiLog[]; pagination: Pagination }>("/analytics/ai-logs", {
        params,
      })
      .then((r: any) => r.data),
};
