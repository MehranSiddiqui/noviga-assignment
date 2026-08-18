import axios from "axios";
import { StorageManager } from "../utils/storageManager";
import { OfflineDataService } from "./offlineDataService";

// Extend Window interface for our custom properties
interface Window {
  __FORCE_OFFLINE_MODE__?: boolean;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Flag to force offline mode (can be set via environment variable or runtime flag)
const isOfflineModeEnabled =
  import.meta.env?.VITE_OFFLINE_MODE === "true" ||
  (window as Window)?.__FORCE_OFFLINE_MODE__ === true;

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = StorageManager.getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If offline mode is enabled, skip the actual request and use offline data
    if (
      isOfflineModeEnabled &&
      OfflineDataService.hasOfflineData(config.url as string)
    ) {
      if (import.meta.env?.MODE === "development") {
        console.log(
          `[API Request] Using offline data (offline mode enabled) for ${config.url}`,
        );
      }

      try {
        // Load offline data and attach to config for response interceptor to use
        const offlineData = await OfflineDataService.loadOfflineData(
          config.url as string,
          false,
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (config as any).__offlineData = offlineData;
        return config;
      } catch (offlineError) {
        console.error(
          "[Offline Data Error in Request Interceptor]",
          offlineError,
        );
        // If offline data loading fails, proceed with normal request
        return config;
      }
    }

    // Log request in development
    if (import.meta.env?.MODE === "development") {
      console.log(
        `[API Request] ${config.method?.toUpperCase() || "GET"} ${config.url}`,
        {
          data: config.data,
          headers: config.headers,
          params: config.params,
        },
      );
    }

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  },
);

// Response interceptor for handling responses and errors with offline fallback
apiClient.interceptors.response.use(
  (response) => {
    // Check if we have offline data attached to the config (from request interceptor)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const configAny = response.config as any;
    if (response.config && configAny.__offlineData) {
      const offlineData = configAny.__offlineData;
      // Clean up to avoid potential memory leak
      delete configAny.__offlineData;
      return offlineData.data;
    }

    // Log response in development
    if (import.meta.env?.MODE === "development") {
      console.log(
        `[API Response] ${response.config?.method?.toUpperCase() || "GET"} ${response.config?.url}`,
        {
          status: response.status,
          data: response.data,
          headers: response.headers,
        },
      );
    }

    // Return data if available (matches original behavior)
    if (response?.data) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    // Log error in development
    if (import.meta.env?.MODE === "development") {
      console.error("[API Response Error]", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Handle 401 Unauthorized
    if (error?.response?.status === 401) {
      StorageManager.removeToken();
      if (window?.location?.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Try to serve offline data as fallback for failed API calls
    const { config } = error;
    if (config) {
      const { url } = config;

      // Extract the path from the full URL to match against our endpoint mappings
      // Assuming the url is like: https://api.example.com/auth/login
      // We want to extract: /auth/login
      let endpointPath = url;
      try {
        const urlObj = new URL(url);
        endpointPath = urlObj.pathname;
      } catch (err) {
        // If URL parsing fails, use the url as-is (might already be just a path)
        console.warn(
          "[API Client] Failed to parse URL for offline data matching:",
          url,
          err,
        );
      }

      // Check if we have offline data for this endpoint
      if (OfflineDataService.hasOfflineData(endpointPath)) {
        try {
          // Log that we're using offline data
          if (import.meta.env?.MODE === "development") {
            console.log(
              `[API Fallback] Using offline data for ${endpointPath}`,
            );
          }

          // Load and return offline data (use cache for performance)
          const offlineData = await OfflineDataService.loadOfflineData(
            endpointPath,
            true,
          );
          return offlineData;
        } catch (offlineError) {
          console.error("[Offline Data Error]", offlineError);
          // If offline data loading fails, reject with original error
          // But only if we're not in a development mode that prefers offline data
          if (import.meta.env?.VITE_USE_OFFLINE_DATA_AS_PRIMARY !== "true") {
            return Promise.reject(error);
          }
          // If we're configured to use offline as primary, still return what we got
          // even if there was an error loading it (though this shouldn't happen with good fallback)
        }
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
