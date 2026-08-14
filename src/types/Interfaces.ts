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
export interface MappedAsset {
  id: string;
  name: string;
  assetLevelId: number;
}
export interface MappedShift {
  shiftId: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  label: string;
}
export interface RawAssetNode {
  id: string;
  name?: string | undefined;
  codename?: string | null;
  assetlevel_id: number;
  children?: RawAssetNode[] | null;
}

export interface RawShift {
  id: string;
  name: string;
  shift_timings: string[];
}
