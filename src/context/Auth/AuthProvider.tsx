import { useState, useEffect, type ReactNode } from "react";
import { StorageManager } from "../../utils/storageManager";
import { authAPI } from "../../networkManager";
import { AuthContext } from "./authContext";


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const initializeAuth = async (): Promise<void> => {
            const token = StorageManager.getToken();
            if (token) {
                try {
                    await authAPI.getUser();
                    setIsAuthenticated(true);
                } catch (error) {
                    console.log(error);
                    setIsAuthenticated(false);
                    StorageManager.removeToken();
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (token: string): Promise<void> => {
        StorageManager.setToken(token);
        setIsAuthenticated(true);
    };

    const logout = async (): Promise<void> => {
        StorageManager.removeToken();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

