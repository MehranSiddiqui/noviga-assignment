import type { ApiResponse } from "../types/Interfaces";

export class OfflineDataService {
  private static readonly OFFLINE_DATA_BASE = "/offlineData/";

  private static readonly cache: Map<string, ApiResponse<unknown>> = new Map();

  private static readonly ENDPOINT_TO_OFFLINE_MAP: Record<string, string> = {
    "/analytics-query/machine-intervals": "sample-machine-intervals.json",
    "/analytics-query": "sample-analytics-query-cycle-time.json",
  };

  private static readonly ERROR_ENDPOINT_MAP: Record<string, string> = {
    "/core/assets/tree": "sample-error-404.json",
    "/analytics-query": "sample-error-500.json",
  };

  static async loadOfflineData<T = unknown>(
    endpoint: string,
    useCache: boolean = true,
  ): Promise<ApiResponse<T>> {
    try {
      const offlineFileName = this.ENDPOINT_TO_OFFLINE_MAP[endpoint];
      if (offlineFileName) {
        // Check cache first if enabled
        if (useCache && this.cache.has(offlineFileName)) {
          if (import.meta.env?.MODE === "development") {
            console.log(
              `[OfflineDataService] Loading cached offline data for ${endpoint}`,
            );
          }
          return this.cache.get(offlineFileName) as ApiResponse<T>;
        }

        const response = await fetch(
          `${this.OFFLINE_DATA_BASE}${offlineFileName}`,
        );
        if (!response.ok) {
          throw new Error(
            `Failed to load offline data: ${response.statusText}`,
          );
        }
        const data: ApiResponse<T> = await response.json();

        // Cache the data
        if (useCache) {
          this.cache.set(offlineFileName, data);
        }

        return data;
      }

      const errorFileName = this.ERROR_ENDPOINT_MAP[endpoint];
      if (errorFileName) {
        if (useCache && this.cache.has(errorFileName)) {
          if (import.meta.env?.MODE === "development") {
            console.log(
              `[OfflineDataService] Loading cached offline error data for ${endpoint}`,
            );
          }
          return this.cache.get(errorFileName) as ApiResponse<T>;
        }

        const response = await fetch(
          `${this.OFFLINE_DATA_BASE}${errorFileName}`,
        );
        if (!response.ok) {
          throw new Error(
            `Failed to load offline error data: ${response.statusText}`,
          );
        }
        const data: ApiResponse<T> = await response.json();

        if (useCache) {
          this.cache.set(errorFileName, data);
        }

        return data;
      }

      throw new Error(`No offline data found for endpoint: ${endpoint}`);
    } catch (error) {
      console.error("[OfflineDataService] Error loading offline data:", error);
      throw error;
    }
  }

  static hasOfflineData(endpoint: string): boolean {
    return !!(
      this.ENDPOINT_TO_OFFLINE_MAP[endpoint] ||
      this.ERROR_ENDPOINT_MAP[endpoint]
    );
  }

  static clearCache(): void {
    this.cache.clear();
    if (import.meta.env?.MODE === "development") {
      console.log("[OfflineDataService] Cleared offline data cache");
    }
  }

  static setForceOffline(endpoint: string, forceOffline: boolean): void {
    if (import.meta.env?.MODE === "development") {
      console.log(
        `[OfflineDataService] Force offline for ${endpoint}: ${forceOffline}`,
      );
    }
  }
}
