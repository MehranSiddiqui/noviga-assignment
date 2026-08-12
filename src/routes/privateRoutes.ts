import React from "react";
import type { RouteObject } from "react-router-dom";
import DashboardPage from "../pages/Dashboard";

const privateRoutes: RouteObject[] = [
  { path: "/dashboard", element: React.createElement(DashboardPage) },
];

export default privateRoutes;
