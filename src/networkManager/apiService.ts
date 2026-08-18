import type { ApiPayload, ApiResponse, LoginData } from "../types/Interfaces";
import apiClient from "./apiClient";
import { ENDPOINTS } from "./endPoints";

export const authAPI = {
  login: (data: { username: string; password: string }) =>
    apiClient.post<ApiResponse<LoginData>>(ENDPOINTS.LOGIN.POST, data),
  getUser: () => apiClient.get(ENDPOINTS.LOGIN.GET_USER),
  logout: () => apiClient.post<ApiResponse>(ENDPOINTS.LOGOUT.POST),
};

export const coreAPI = {
  getAssets: () => apiClient.get(ENDPOINTS.CORE.GET_ASSETS),
  getShifts: () => apiClient.get(ENDPOINTS.CORE.GET_SHIFTS),
};

export const analyticsAPI = {
  postTimeline: (data: ApiPayload) =>
    apiClient.post(ENDPOINTS.ANALYTICS.POST_TIMELINE, data),
  postCycleTime: (data: ApiPayload) =>
    apiClient.post(ENDPOINTS.ANALYTICS.POST_CYCLE_TIME, data),
};
