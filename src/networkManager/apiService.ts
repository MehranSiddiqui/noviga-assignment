import apiClient from "./apiClient";
import { ENDPOINTS } from "./endPoints";


export const authAPI = {

  login: (data: { email: string; password: string }) =>
    apiClient.post(ENDPOINTS.LOGIN.POST, data),
  getUser: () => apiClient.get(ENDPOINTS.LOGIN.GET_USER),
  logout: () => apiClient.post(ENDPOINTS.LOGOUT.POST),
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