import React from "react";
import type { RouteObject } from "react-router-dom";
import LoginPage from "../pages/Auth/Login";

const publicRoutes: RouteObject[] = [
  { path: "/login", element: React.createElement(LoginPage) },
];

export default publicRoutes;
