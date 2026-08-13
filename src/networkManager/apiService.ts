import type { ApiResponse, LoginData } from "../types/Interfaces";
import apiClient from "./apiClient";
import { ENDPOINTS } from "./endPoints";

export const authAPI = {
  login: (data: { username: string; password: string }) =>
    apiClient.post<ApiResponse<LoginData>>(
      ENDPOINTS.LOGIN.POST,
      data,
    ) as unknown as Promise<ApiResponse<LoginData>>,
  getUser: () =>
    apiClient.get<ApiResponse>(
      ENDPOINTS.LOGIN.GET_USER,
    ) as unknown as Promise<ApiResponse>,
  logout: () =>
    apiClient.post<ApiResponse>(
      ENDPOINTS.LOGOUT.POST,
    ) as unknown as Promise<ApiResponse>,
};

export const coreAPI = {
  getAssets: () => apiClient.get(ENDPOINTS.CORE.GET_ASSETS),
  getShifts: () => apiClient.get(ENDPOINTS.CORE.GET_SHIFTS),
};

export const analyticsAPI = {
  postTimeline: (data: Record<string, string | number | boolean>) =>
    apiClient.post(ENDPOINTS.ANALYTICS.POST_TIMELINE, data),
  postCycleTime: (data: Record<string, string | number | boolean>) =>
    apiClient.post(ENDPOINTS.ANALYTICS.POST_CYCLE_TIME, data),
};
