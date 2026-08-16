export type ResponseData = {
  status_code: number;
  data: object;
  message: string;
};

export type FilterState = {
  assetId?: string;
  shiftId?: string;
  date?: string;
};
export type ActiveFilterState = {
  assetId?: string;
  shiftId?: string;
  date?: string;
  exactProduces?: boolean;
  assetLevelId?: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
};
