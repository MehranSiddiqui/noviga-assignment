import apiClient from "./apiClient";
import { ENDPOINTS } from "./endPoints";

export interface ApiResponse<T = unknown> {
  trace_id: string;
  status_code: number;
  message: string;
  data: T;
}

export interface LoginData {
  access_token: string;
}

export const authAPI = {
  login: (data: { username: string; password: string }) =>
    apiClient.post<ApiResponse<LoginData>>(ENDPOINTS.LOGIN.POST, data) as unknown as Promise<ApiResponse<LoginData>>,
  getUser: () =>
    apiClient.get<ApiResponse>(ENDPOINTS.LOGIN.GET_USER) as unknown as Promise<ApiResponse>,
  logout: () =>
    apiClient.post<ApiResponse>(ENDPOINTS.LOGOUT.POST) as unknown as Promise<ApiResponse>,
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
