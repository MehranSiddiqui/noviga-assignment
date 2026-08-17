import type { ApiResponse } from "../types/Interfaces";

/**
 * Service for loading offline data as fallback when API calls fail
 */
export class OfflineDataService {
  private static readonly OFFLINE_DATA_BASE = "/offlineData/";

  // Cache for offline data to avoid refetching
  private static readonly cache: Map<string, ApiResponse<unknown>> = new Map();

  // Mapping of API endpoints to their corresponding offline data files
  private static readonly ENDPOINT_TO_OFFLINE_MAP: Record<string, string> = {
    // Auth endpoints
    "/auth/login": "sample-auth-login.json",
    "/auth/me": "sample-auth-me.json",
    "/auth/logout": "sample-auth-logout.json",

    // Core endpoints
    "/core/assets/tree": "sample-assets-tree.json",
    "/core/shifts": "sample-shifts.json",

    // Analytics endpoints
    "/analytics-query/machine-intervals": "sample-machine-intervals.json",
    "/analytics-query": "sample-analytics-query-cycle-time.json",
  };

  // Error endpoints that should return specific error responses
  private static readonly ERROR_ENDPOINT_MAP: Record<string, string> = {
    "/auth/login": "sample-error-401.json",
    "/auth/me": "sample-error-403.json",
    "/core/assets/tree": "sample-error-404.json",
    "/analytics-query": "sample-error-500.json",
  };

  /**
   * Load offline data for a given endpoint
   * @param endpoint The API endpoint (e.g., "/auth/login")
   * @param useCache Whether to use cached data if available (default: true)
   * @returns Promise that resolves with the offline data or rejects if not found
   */
  static async loadOfflineData<T = unknown>(endpoint: string, useCache: boolean = true): Promise<ApiResponse<T>> {
    try {
      // Check if we have offline data for this endpoint
      const offlineFileName = this.ENDPOINT_TO_OFFLINE_MAP[endpoint];
      if (offlineFileName) {
        // Check cache first if enabled
        if (useCache && this.cache.has(offlineFileName)) {
          if (import.meta.env?.MODE === "development") {
            console.log(`[OfflineDataService] Loading cached offline data for ${endpoint}`);
          }
          return this.cache.get(offlineFileName);
        }

        const response = await fetch(`${this.OFFLINE_DATA_BASE}${offlineFileName}`);
        if (!response.ok) {
          throw new Error(`Failed to load offline data: ${response.statusText}`);
        }
        const data: ApiResponse<T> = await response.json();

        // Cache the data
        if (useCache) {
          this.cache.set(offlineFileName, data);
        }

        return data;
      }

      // Check for error simulations
      const errorFileName = this.ERROR_ENDPOINT_MAP[endpoint];
      if (errorFileName) {
        // Check cache first if enabled
        if (useCache && this.cache.has(errorFileName)) {
          if (import.meta.env?.MODE === "development") {
            console.log(`[OfflineDataService] Loading cached offline error data for ${endpoint}`);
          }
          return this.cache.get(errorFileName);
        }

        const response = await fetch(`${this.OFFLINE_DATA_BASE}${errorFileName}`);
        if (!response.ok) {
          throw new Error(`Failed to load offline error data: ${response.statusText}`);
        }
        const data: ApiResponse<T> = await response.json();

        // Cache the data
        if (useCache) {
          this.cache.set(errorFileName, data);
        }

        // For error simulations, we still return the data but the calling service should handle it as an error
        return data;
      }

      throw new Error(`No offline data found for endpoint: ${endpoint}`);
    } catch (error) {
      console.error('[OfflineDataService] Error loading offline data:', error);
      throw error;
    }
  }

  /**
   * Check if offline data exists for an endpoint
   * @param endpoint The API endpoint
   * @returns true if offline data is available
   */
  static hasOfflineData(endpoint: string): boolean {
    return !!(
      this.ENDPOINT_TO_OFFLINE_MAP[endpoint] ||
      this.ERROR_ENDPOINT_MAP[endpoint]
    );
  }

  /**
   * Clear the offline data cache
   */
  static clearCache(): void {
    this.cache.clear();
    if (import.meta.env?.MODE === "development") {
      console.log('[OfflineDataService] Cleared offline data cache');
    }
  }

  /**
   * Force a specific endpoint to return offline data (useful for testing)
   * @param endpoint The API endpoint to force offline
   * @param forceOffline Whether to force offline mode for this endpoint
   */
  static setForceOffline(endpoint: string, forceOffline: boolean): void {
    // This is a placeholder for future implementation
    // Could be used to force offline mode for specific endpoints during development
    if (import.meta.env?.MODE === "development") {
      console.log(`[OfflineDataService] Force offline for ${endpoint}: ${forceOffline}`);
    }
  }
}