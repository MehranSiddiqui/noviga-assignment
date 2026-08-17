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

export interface ShiftBucket {
  index: number;
  startUtc: string;
  endUtc: string;
  startMs: number;
  endMs: number;
  startIstLabel: string;
  endIstLabel: string;
  label: string;
  durationMinutes: number;
  isElapsed: boolean;
}

export interface ProcessedHour {
  bucket: ShiftBucket;
  total: number;
  pass: number;
  fail: number;
  actualCycleTime: number | null;
  idealCycleTime: number | null;
  runtime: number;
  plannedDowntime: number;
  minorStoppage: number;
  unknownDowntime: number;
  unplannedDowntime: number;
  unplannedProduction: number;
  unknownUnplannedProduction: number;
}

export interface Rows {
  key: string;
  label: string;
  suffix?: string;
  isFloat?: boolean;
}

export interface ApiPayload {
  entity_scope: {
    type: string;
    asset: {
      asset_id: string;
      asset_level_id?: number;
    };
  };
  time_range: {
    from_ts: string;
    to_ts: string;
  };

  distribution?: string;
  metrics?: string[];
  
}

export interface ProcessedHour {
  bucket: ShiftBucket;
  total: number;
  pass: number;
  fail: number;
  actualCycleTime: number | null;
  idealCycleTime: number | null;
  runtime: number;
  plannedDowntime: number;
  minorStoppage: number;
  unknownDowntime: number;
  unplannedDowntime: number;
  unplannedProduction: number;
  unknownUnplannedProduction: number;
}
