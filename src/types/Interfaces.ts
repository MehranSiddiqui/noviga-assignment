export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface ApiResponse<T = unknown> {
  trace_id: string;
  status_code: number;
  message: string;
  data: T;
}

export interface LoginData {
  access_token: string;
}
