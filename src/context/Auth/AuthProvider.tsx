import { useState, useEffect, type ReactNode } from "react";
import { StorageManager } from "../../utils/storageManager";
import { authAPI } from "../../networkManager";
import { getApiErrorMessage } from "../../networkManager/apiError";
import { AuthContext } from "./authContext";
import type { UserData } from "../../types/Interfaces";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserData | null>(null);

  const token = StorageManager.getToken();
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      setIsLoading(true);

      if (token) {
        try {
          const response = await authAPI.getUser();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error(
            "AuthProvider: getUser error",
            getApiErrorMessage(error),
          );
          setIsAuthenticated(false);
          setUser(null);
          StorageManager.removeToken();
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (token: string): Promise<void> => {
    // Optimistically set token and authenticated state
    StorageManager.setToken(token);
    const response = await authAPI.getUser();
    setUser(response.data);
    setIsAuthenticated(true);
    // Note: effect will refetch user data due to token change dependency
  };

  const logout = async (): Promise<void> => {
    StorageManager.removeToken();
    setIsAuthenticated(false);
    setUser(null);
  
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
