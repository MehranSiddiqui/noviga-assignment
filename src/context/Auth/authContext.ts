import { createContext } from "react";
import type { AuthContextType } from "../../types/Interfaces";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
