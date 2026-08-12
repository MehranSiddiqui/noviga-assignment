import { useContext } from "react";
import type { AuthContextType } from "../types/Interfaces";
import { AuthContext } from "../context/Auth/authContext";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
