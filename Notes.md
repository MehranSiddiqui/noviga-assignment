# Project Notes: Manufacturing Dashboard

## 1. State Management & React Compiler Fixes
*   **Auto-Initialization**: Implemented logic to safely auto-select the first available Asset, Shift, and current Date (via DayJS) when the API data initially loads.
*   **Fixing Cascading Renders**: Addressed the React Compiler error (`Calling setState synchronously within an effect can trigger cascading renders`). 
    *   *Solution*: Removed the reactive `useEffect` that watched for asset mismatches. Moved the cascading dropdown logic directly into the `onChange` event handler (`handleFilterState`), resolving it in a single render cycle.
*   **Compiler-Safe Accumulators**: Fixed the "Cannot reassign variable after render completes" error when calculating cumulative production.
    *   *Solution*: Replaced `.map()` with a pure `.reduce()` function to calculate the running total, passing the accumulator forward instead of mutating an external `let` variable.

## 2. Storage Strategy: Key Management
*   **Decision**: Chose **`localStorage`** to store the key/token on the client side. 
*   **Why `localStorage`?** 
    *   **Persistence**: Data survives browser restarts and is shared across all tabs of the same origin. In a dashboard application, users frequently open different machines or reports in new tabs; `localStorage` ensures they don't have to re-enter the key or re-authenticate for every new tab.
    *   **Capacity & Access**: Provides ample storage (~5-10MB) and is instantly accessible synchronously via JavaScript.
*   **Why not `sessionStorage`?**
    *   `sessionStorage` is strictly isolated per tab and clears completely when the tab is closed. If a user middle-clicks a link to open a machine view in a new tab, the key would be lost, resulting in a fractured and frustrating User Experience (UX).
*   **Why not Cookies?**
    *   Cookies are automatically appended to every single HTTP request sent to the server. If this key is primarily needed for client-side operations (like unlocking a UI feature, charting license, or a specific API header setup), using a cookie adds unnecessary payload bloat to network requests. 
    *   Cookies also have a very small size limit (~4KB) compared to Web Storage.

## 3. Offline Data Strategy
*   **Implementation**: Integrated offline data fallback mechanism using `OfflineDataService` and API interceptors in `apiClient.ts`.
*   **How It Works**:
    *   Maps API endpoints to local JSON files (e.g., `/analytics-query` → `sample-analytics-query-cycle-time.json`)
    *   Automatically serves offline data when API calls fail (network errors, timeouts, etc.)
    *   Implements caching to prevent redundant fetches of the same JSON files
    *   Provides runtime controls for enabling/disabling offline mode via browser console or environment variables
*   **Benefits**:
    *   **Resilience**: Application continues working during API/server outages with graceful degradation
    *   **Development**: Enables offline development and fast iteration without waiting for API responses
    *   **Performance**: Caching reduces redundant data fetching and eliminates network latency for cached data
    *   **Testing**: Easy simulation of various error conditions (400, 403, 404, 500) for comprehensive error handling testing
    *   **Debugging**: Clear visibility into when offline data is being served via enhanced logging
*   **Configuration**:
    *   `VITE_OFFLINE_MODE=true` - Force ALL API calls to use offline data (no network requests)
    *   `VITE_PREFER_OFFLINE_DATA=true` - Prefer offline data when available (development optimization)
    *   Runtime controls: `enableOfflineMode()`, `disableOfflineMode()`, `toggleOfflineMode()`, `getOfflineModeStatus()`, `clearOfflineCache()`

## 4. API & Data Handling
*   **TanStack Query Reactivity**: Fixed the issue where toggling UI switches (like "Exact Produces") did not trigger a new API call.
    *   *Solution*: Added the entire `payload` object into the `queryKey` array (e.g., `queryKey: ['timelineData', payload]`).
*   **API 422 Unprocessable Entity (`extra_forbidden`)**: The backend enforces strict Pydantic schemas. The Cycle Time API crashes if it receives the `exact_produces` key.
    *   *Solution*: Created a 3-tier payload strategy using `useMemo`:
        1.  `basePayload`: Shared fields (time range, asset scope).
        2.  `timelinePayload`: Extends Base. Injects chart-specific keys (`exact_produces`, `produce_counts`).
        3.  `cycleTimePayload`: Extends Base. Strictly limited to `distribution` and `metrics`.
*   **Strict UTC Time Formatting**: The API rejected timezone offsets like `+00:00` and milliseconds.
    *   *Solution*: Used DayJS with the format string `YYYY-MM-DDTHH:mm:ss[Z]` to escape the 'Z' and force the exact string format the backend requires.

## 5. UI Components & Layout
*   **Global Loading Context**: Created a `LoadingContext` wrapped around an MUI `<Backdrop>` to allow any component in the app to freeze the screen and show a spinner during heavy asynchronous operations.
*   **Cascading Dropdowns**: Separated "Asset Level" and "Asset" into distinct dropdowns. Selecting a level dynamically filters the available assets, preventing mismatched IDs from being sent to the backend.
*   **Dropdown Data Mapping**: Adjusted raw API arrays to match the strict `DropdownOption` interface (`{ id, name }`) required by the `<CustomDropdown>` components.

## 6. Controller Pattern Usage
*   **Why Controllers Are Used**:
    *   **Separation of Concerns**: Controllers separate business logic from UI components, making components cleaner and more focused on rendering
    *   **State Management**: Encapsulate state logic (useState, useReducer) preventing state-related bugs in components
    *   **Data Transformation**: Handle complex data transformations (mapping API responses to dropdown options, building payloads with proper formatting)
    *   **Performance Optimization**: Use useMemo/useCallback to prevent unnecessary recalculations and renders
    *   **Side Effect Management**: Manage useEffect hooks for data fetching and side effects in one place
    *   **Reusability**: Controller logic can be reused across components when needed
    *   **Testability**: Business logic is isolated and easier to unit test independently
    *   **Complex Logic Encapsulation**: Handle complex cascading logic (like asset level filtering affecting available assets) without cluttering components

*   **Controller Examples in Codebase**:
    *   `useDashboardController()`: Manages active filters state for the dashboard
    *   `useFilterBarController()`: Handles complex filter logic including asset level cascading, shift/date initialization, and API payload building
    *   `useTableChartController()`: Manages chart-specific logic like timeline/cycle time queries, point/label toggles, and data processing
    *   `useLoginController()`: Handles form state and submission logic for login

## 7. Charting Architecture (Apache ECharts)
*   **Library Selection**: Evaluated Recharts (SVG), SciChart (WASM/WebGL), and Apache ECharts (Canvas). Selected ECharts because it easily handles 10,000+ data points without DOM lag and is free/open-source.
*   **Component State Isolation**: Shifted toggles like `exactProduces` and `showPointLabels` out of the chart and into the parent controller so TanStack Query can react to them.
*   **Hybrid Time-Series Visuals**:
    *   **Background Gantt Bands**: Utilized ECharts' `markArea` injected into the series to draw colored state blocks (Runtime, Downtime, Stoppages) with 90-degree rotated labels.
    *   **Dynamic Series Type**: Used a ternary operator (`type: exactProduces ? 'scatter' : 'line'`) to seamlessly transition between an aggregated cumulative line chart and a scatter plot of individual machine produces.
    *   **Custom Symbols**: Programmatically changed scatter plot symbols (Circle, Cross, Triangle) based on the individual produce status (OK, FAIL, WIP).