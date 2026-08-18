# Project Notes: Manufacturing Dashboard

## 1. State Management & React Compiler Fixes

- **Auto-Initialization**: Implemented logic to safely auto-select the first available Asset, Shift, and current Date (via DayJS) when the API data initially loads.
- **Fixing Cascading Renders**: Addressed the React Compiler error (`Calling setState synchronously within an effect can trigger cascading renders`).
  - _Solution_: Removed the reactive `useEffect` that watched for asset mismatches. Moved the cascading dropdown logic directly into the `onChange` event handler (`handleFilterState`), resolving it in a single render cycle.
- **Compiler-Safe Accumulators**: Fixed the "Cannot reassign variable after render completes" error when calculating cumulative production.
  - _Solution_: Replaced `.map()` with a pure `.reduce()` function to calculate the running total, passing the accumulator forward instead of mutating an external `let` variable.

## 2. Storage Strategy: Key Management

- **Decision**: Chose **`localStorage`** to store the key/token on the client side.
- **Why `localStorage`?**
  - **Persistence**: Data survives browser restarts and is shared across all tabs of the same origin. In a dashboard application, users frequently open different machines or reports in new tabs; `localStorage` ensures they don't have to re-enter the key or re-authenticate for every new tab.
  - _Capacity & Access_: Provides ample storage (~5-10MB) and is instantly accessible synchronously via JavaScript.
- **Why not `sessionStorage`?**
  - `sessionStorage` is strictly isolated per tab and clears completely when the tab is closed. If a user middle-clicks a link to open a machine view in a new tab, the key would be lost, resulting in a fractured and frustrating User Experience (UX).
- **Why not Cookies?**
  - Cookies are automatically appended to every single HTTP request sent to the server. If this key is primarily needed for client-side operations (like unlocking a UI feature, charting license, or a specific API header setup), using a cookie adds unnecessary payload bloat to network requests.
  - Cookies also have a very small size limit (~4KB) compared to Web Storage.

## 3. Offline Data Strategy

- **Implementation**: Integrated offline data fallback mechanism using `OfflineDataService` and API interceptors in `apiClient.ts`.
- **How It Works**:
  - Maps API endpoints to local JSON files (e.g., `/analytics-query` → `sample-analytics-query-cycle-time.json`)
  - Automatically serves offline data when API calls fail (network errors, timeouts, etc.)
  - Implements caching to prevent redundant fetches of the same JSON files
  - Provides runtime controls for enabling/disabling offline mode via browser console or environment variables
- **Benefits**:
  - **Resilience**: Application continues working during API/server outages with graceful degradation
  - **Development**: Enables offline development and fast iteration without waiting for API responses
  - **Performance**: Caching reduces redundant data fetching and eliminates network latency for cached data
  - **Testing**: Easy simulation of various error conditions (400, 403, 404, 500) for comprehensive error handling testing
  - **Debugging**: Clear visibility into when offline data is being served via enhanced logging
- **Configuration**:
  - `VITE_OFFLINE_MODE=true` - Force ALL API calls to use offline data (no network requests)
  - `VITE_PREFER_OFFLINE_DATA=true` - Prefer offline data when available (development optimization)
  - Runtime controls: `enableOfflineMode()`, `disableOfflineMode()`, `toggleOfflineMode()`, `getOfflineModeStatus()`, `clearOfflineCache()`

## 4. API & Data Handling

- **TanStack Query Reactivity**: Fixed the issue where toggling UI switches (like "Exact Produces") did not trigger a new API call.
  - _Solution_: Added the entire `payload` object into the `queryKey` array (e.g., `queryKey: ['timelineData', payload]`).
- **API 422 Unprocessable Entity (`extra_forbidden`)**: The backend enforces strict Pydantic schemas. The Cycle Time API crashes if it receives the `exact_produces` key.
  - _Solution_: Created a 3-tier payload strategy using `useMemo`:
    1.  `basePayload`: Shared fields (time range, asset scope).
    2.  `timelinePayload`: Extends Base. Injects chart-specific keys (`exact_produces`, `produce_counts`).
    3.  `cycleTimePayload`: Extends Base. Strictly limited to `distribution` and `metrics`.
- **Strict UTC Time Formatting**: The API rejected timezone offsets like `+00:00` and milliseconds.
  - _Solution_: Used DayJS with the format string `YYYY-MM-DDTHH:mm:ss[Z]` to escape the 'Z' and force the exact string format the backend requires.

## 5. UI Components & Layout

- **Global Loading Context**: Created a `LoadingContext` wrapped around an MUI `<Backdrop>` to allow any component in the app to freeze the screen and show a spinner during heavy asynchronous operations.
- **Cascading Dropdowns**: Separated "Asset Level" and "Asset" into distinct dropdowns. Selecting a level dynamically filters the available assets, preventing mismatched IDs from being sent to the backend.
- **Dropdown Data Mapping**: Adjusted raw API arrays to match the strict `DropdownOption` interface (`{ id, name }`) required by the `<CustomDropdown>` components.

## 6. Controller Pattern Usage

- **Why Controllers Are Used**:
  - **Separation of Concerns**: Controllers separate business logic from UI components, making components cleaner and more focused on rendering
  - **State Management**: Encapsulate state logic (useState, useReducer) preventing state-related bugs in components
  - **Data Transformation**: Handle complex data transformations (mapping API responses to dropdown options, building payloads with proper formatting)
  - **Performance Optimization**: Use useMemo/useCallback to prevent unnecessary recalculations and renders
  - **Side Effect Management**: Manage useEffect hooks for data fetching and side effects in one place
  - **Reusability**: Controller logic can be reused across components when needed
  - **Testability**: Business logic is isolated and easier to unit test independently
  - **Complex Logic Encapsulation**: Handle complex cascading logic (like asset level filtering affecting available assets) without cluttering components

- **Controller Examples in Codebase**:
  - `useDashboardController()`: Manages active filters state for the dashboard
  - `useFilterBarController()`: Handles complex filter logic including asset level cascading, shift/date initialization, and API payload building
  - `useTableChartController()`: Manages chart-specific logic like timeline/cycle time queries, point/label toggles, and data processing
  - `useLoginController()`: Handles form state and submission logic for login

## 7. Charting Architecture (Apache ECharts)

- **Library Selection**: Evaluated Recharts (SVG), SciChart (WASM/WebGL), and Apache ECharts (Canvas). Selected ECharts because it easily handles 10,000+ data points without DOM lag and is free/open-source.
- **Component State Isolation**: Shifted toggles like `exactProduces` and `showPointLabels` out of the chart and into the parent controller so TanStack Query can react to them.
- **Hybrid Time-Series Visuals**:
  - **Background Gantt Bands**: Utilized ECharts' `markArea` injected into the series to draw colored state blocks (Runtime, Downtime, Stoppages) with 90-degree rotated labels.
  - **Dynamic Series Type**: Used a ternary operator (`type: exactProduces ? 'scatter' : 'line'`) to seamlessly transition between an aggregated cumulative line chart and a scatter plot of individual machine produces.
  - **Custom Symbols**: Programmatically changed scatter plot symbols (Circle, Cross, Triangle) based on the individual produce status (OK, FAIL, WIP).

## 8. API Client Implementation

### Core Features in `apiClient.ts`:

1. **Axios Instance Setup**
   - Configured with base URL from `VITE_API_BASE_URL` environment variable
   - Default headers: `Content-Type: application/json`
   - 30-second timeout

2. **Request Interceptor**
   - **Authentication**: Automatically adds JWT token from `StorageManager` to requests
   - **Offline Mode Detection**:
     - Checks `VITE_OFFLINE_MODE` environment variable
     - Checks runtime flag `window.__FORCE_OFFLINE_MODE__`
   - **Offline Data Pre-loading**: When offline mode is enabled:
     - Loads appropriate offline JSON data for the endpoint
     - Attaches data to request config for response interceptor
     - Development logging shows when offline data is used
   - **Development Logging**: Logs request details (method, URL, data, headers, params)

3. **Response Interceptor**
   - **Success Handling**: Returns response data (maintains original axios behavior)
   - **401 Handling**: Removes invalid token and redirects to login page
   - **Offline Fallback**: For failed API calls:
     - Extracts endpoint path from URL
     - Checks if offline data exists via `OfflineDataService`
     - Loads and returns cached offline data when available
     - Development logging shows fallback usage
   - **Development Logging**: Logs response details (status, data, headers)

4. **Typed API Client Wrapper**
   - Provides strongly-typed `get`, `post`, `put`, `patch`, `delete` methods
   - Maintains compatibility with existing code

### Supporting Files:

#### `offlineDataService.ts`:

- **Endpoint Mapping**: Maps API endpoints to local JSON files:
  - `/analytics-query/machine-intervals` → `sample-machine-intervals.json`
  - `/analytics-query` → `sample-analytics-query-cycle-time.json`
- **Error Simulation**: Maps endpoints to error JSON files for testing:
  - `/core/assets/tree` → `sample-error-404.json`
  - `/analytics-query` → `sample-error-500.json`
- **Caching System**: Uses Map-based cache to prevent redundant fetches
- **Cache Management**: Methods to load data, check availability, and clear cache

#### `offlineModeController.ts`:

- **Runtime Controls** (accessible via `window.__offlineModeController`):
  - `enableOfflineMode()` - Forces offline mode
  - `disableOfflineMode()` - Disables offline mode
  - `toggleOfflineMode()` - Toggles offline mode state
  - `clearOfflineCache()` - Clears offline data cache
  - `getOfflineModeStatus()` - Returns current offline mode status

### Configuration & Features (Per Project Notes):

- **Environment Variables**:
  - `VITE_OFFLINE_MODE=true` - Forces ALL API calls to use offline data
  - `VITE_PREFER_OFFLINE_DATA=true` - Prefers offline data when available (development optimization)

- **Key Benefits Implemented**:
  - **Resilience**: Graceful degradation during API/server outages
  - **Development**: Enables offline development/fast iteration
  - **Performance**: Caching eliminates network latency for cached data
  - **Testing**: Easy simulation of error conditions (400, 403, 404, 500)
  - **Debugging**: Enhanced logging shows when offline data is served

- **API Handling Improvements** (from notes):
  - **TanStack Query Reactivity**: Fixed by including payload in queryKey
  - **API 422 Errors**: Solved with 3-tier payload strategy using useMemo
  - **UTC Time Formatting**: Using DayJS format `YYYY-MM-DDTHH:mm:ss[Z]`

## 9. Deployment: CORS Error on Vercel

- **Symptom**: After deploying the frontend to Vercel (`https://noviga-assignment.vercel.app`), the login request to
  `https://fractaldmsdev.centralindia.cloudapp.azure.com/auth/login` failed in the browser with a generic
  **"Network Error"** in the UI. DevTools Network tab showed the `login` request in red with **0 response
  headers** — the request never got a response the browser would expose to JS.
- **Root Cause**: This is a **CORS block**, not an app bug. The frontend (`noviga-assignment.vercel.app`) and the
  backend (`fractaldmsdev.centralindia.cloudapp.azure.com`) are different origins. Unless the backend explicitly
  returns an `Access-Control-Allow-Origin` header permitting the frontend's origin, the browser blocks the
  response before any JS (including axios's interceptors) ever sees it — which is why it surfaces as an opaque
  "Network Error" instead of a normal HTTP error status.
- **Why This Can't Be Fixed on the Frontend**: CORS is enforced by the browser based on headers the **server**
  sends back. No amount of frontend code, retry logic, or axios config can bypass a genuine CORS block — the
  fix has to happen server-side (allow-listing the deployed origin), or via a request-proxying layer that sits
  between the frontend and backend.
- **Assignment Note**: The assignment brief only specifies "a deployed link (Netlify, Vercel, etc.)" — it does
  not mandate a specific host, and Vercel is explicitly listed as an acceptable option. Since the backend URL is
  provided as-is and its CORS configuration is outside candidate control, this was flagged as a question for the
  assignment's doubt-clearing call rather than something to work around client-side.
- **Things Checked/Ruled Out**:
  - Confirmed the deployed Vercel URL matches exactly what would need to be allow-listed (including checking
    whether a Vercel **preview** URL, which differs per branch/PR, was being used instead of the production
    domain).
  - Confirmed the backend URL itself is `https://` (not an `http://` mixed-content issue).
  - Confirmed the request is a simple JSON `POST`, which triggers a browser CORS preflight (`OPTIONS`) — so the
    backend (or any proxy in front of it) needs to respond correctly to `OPTIONS` as well as the real `POST`,
    not just the `POST`.
