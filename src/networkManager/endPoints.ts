export const ENDPOINTS = {
  LOGIN: {
    POST: "/auth/login",
    GET_USER: "/auth/me",
  },
  LOGOUT: {
    POST: "/auth/logout",
  },
  CORE: {
    GET_ASSETS: "/core/assets/tree",
    GET_SHIFTS: "/core/shifts",
  },
  ANALYTICS: {
    POST_TIMELINE: "/analytics-query/machine-intervals",
    POST_CYCLE_TIME: "/analytics-query",
  },
};
