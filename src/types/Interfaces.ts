import type { ReactNode } from "react";

export interface UserData {
  id: string;
  hid: number;
  username: string;
  email: string;
  name: string;
  customer_id: string;
  customer_name: string;
  designation_id: string;
  designation_name: string;
  department_id: string;
  department_name: string;
  status: string;
  roles: string[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserData | null;
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

export interface LoginRequest {
  username: string;
  password: string;
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
  isElapsed?: boolean;
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
  exact_produces?: boolean;
  produce_counts?: boolean;
  group_produce_counts_by_part_model?: boolean;
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

export interface Interval {
  start_at: string;
  end_at: string;
  type?: string;
  category?: string;
  planned?: boolean;
}

export interface ProduceCount {
  bucket_start: string;
  ok_count: number;
  ng_count: number;
}

export interface IndividualProduce {
  ts: string;
  status: "OK" | "FAIL" | "WIP";
}

export interface ProductionHistoryChartProps {
  timelineData: {
    runtimes?: Interval[];
    downtimes?: Interval[];
    stoppages?: Interval[];
    produce_counts?: ProduceCount[];
    produces?: IndividualProduce[];
  };
  shiftStartTime: string;
  shiftEndTime: string;
  isLoading?: boolean;
  exactProduces?: boolean;
  showPointLabels?: boolean;
  togglePointLabels?: (key: string) => void;
}

export interface IndividualSeriesData {
  value: [number, number];
  status: IndividualProduce["status"];
}

export interface TooltipParam {
  value: number[];
}

export interface SymbolCallbackParams {
  data?: {
    status: IndividualProduce["status"];
  };
}

export interface Props {
  children: ReactNode;
}

export interface State {
  hasError: boolean;
  error: Error | null;
}
