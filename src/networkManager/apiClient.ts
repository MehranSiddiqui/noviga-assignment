import axios from "axios";
import { StorageManager } from "../utils/storageManager";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = StorageManager.getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    if (response?.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      StorageManager.removeToken();
      if (window?.location?.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
