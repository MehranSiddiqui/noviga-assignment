# Offline Data Integration Summary

This document summarizes the improvements made to the offline data integration in the Wellfound project.

## Overview

The offline data integration provides a fallback mechanism for when API calls fail, allowing the application to continue functioning by using locally stored JSON data files.

## Key Improvements

### 1. Fixed URL Matching Bug
**Issue**: The API client was comparing full URLs (e.g., `https://api.example.com/auth/login`) against path-only mappings (e.g., `/auth/login`), causing the offline fallback to never trigger.

**Fix**: Extract the pathname from the full URL before checking against endpoint mappings.

### 2. Added Caching Mechanism
**Issue**: The OfflineDataService was fetching the same JSON files repeatedly for each request.

**Fix**: Added a simple cache that stores fetched offline data, preventing redundant network requests for the same files during a session.

### 3. Enhanced Error Simulations
Added support for simulating various HTTP error conditions:
- 400 Bad Request (`sample-error-400.json`)
- 403 Forbidden (`sample-error-403.json`) 
- 404 Not Found (`sample-error-404.json`)
- 500 Internal Server Error (`sample-error-500.json`)

Mapped to appropriate endpoints:
- `/auth/login` → 401 Unauthorized
- `/auth/me` → 403 Forbidden
- `/core/assets/tree` → 404 Not Found
- `/analytics-query` → 500 Internal Server Error

### 4. Added Offline Mode Functionality
Users can now force the application to use offline data exclusively:

#### Environment Variables
- `VITE_OFFLINE_MODE=true` - Forces all API calls to use offline data
- `VITE_PREFER_OFFLINE_DATA=true` - Prefers offline data when available (development only)

#### Runtime Control
Attach the following functions to `window` for browser console access:
- `enableOfflineMode()` - Enable offline mode
- `disableOfflineMode()` - Disable offline mode  
- `toggleOfflineMode()` - Toggle offline mode state
- `clearOfflineCache()` - Clear the offline data cache
- `getOfflineModeStatus()` - Check if offline mode is currently enabled

### 5. Improved Developer Experience
- Enhanced logging throughout the offline data flow
- Better error handling with informative messages
- Cache clearing capabilities for testing

## Files Modified/Added

### Modified Files
- `src/networkManager/offlineDataService.ts` - Added caching, error simulations, and offline mode helpers
- `src/networkManager/apiClient.ts` - Fixed URL matching, added offline mode interceptor, enhanced logging
- `src/networkManager/index.ts` - Exported offline mode controller functions

### Added Files
- `src/networkManager/offlineData/spare-error-400.json` - 400 Bad Request simulation
- `src/networkManager/offlineData/sample-error-403.json` - 403 Forbidden simulation  
- `src/networkManager/offlineData/sample-error-404.json` - 404 Not Found simulation
- `src/networkManager/offlineData/sample-error-500.json` - 500 Internal Server Error simulation
- `src/networkManager/offlineModeController.ts` - Runtime control utilities for offline mode

## Usage Examples

### From Browser Console
```javascript
// Enable offline mode (all API calls use local JSON files)
window.__offlineModeController.enableOfflineMode();

// Disable offline mode (resume normal API calls)  
window.__offlineModeController.disableOfflineMode();

// Toggle offline mode state
window.__offlineModeController.toggleOfflineMode();

// Check current status
console.log(window.__offlineModeController.getOfflineModeStatus());

// Clear cached offline data (useful when updating JSON files)
window.__offlineModeController.clearOfflineCache();
```

### Environment Variables (.env file)
```env
VITE_OFFLINE_MODE=true
VITE_PREFER_OFFLINE_DATA=true
```

## How It Works

1. **Normal Operation**: API calls are made to the server as usual
2. **On Failure**: If an API call fails (network error, timeout, etc.), the response interceptor checks if offline data exists for that endpoint and returns it if available
3. **Offline Mode**: When enabled, the request interceptor prevents actual API calls and immediately returns offline data
4. **Caching**: Frequently accessed offline data is cached to improve performance

## Benefits

- **Resilience**: Application continues to work even when API is unavailable
- **Development**: Enables offline development and testing
- **Testing**: Easy simulation of various error conditions
- **Performance**: Caching reduces redundant data fetching
- **Debugging**: Comprehensive logging helps trace offline data usage

## Notes

- Offline data files are stored in `src/networkManager/offlineData/` and follow the ApiResponse format
- The system expects offline data to match the structure of real API responses
- Error simulations return properly formatted ApiResponse objects with appropriate status codes
- In offline mode, no actual network requests are made for configured endpoints