import { useMemo } from "react";
import type { ActiveFilterState } from "../../../types/types";
import {
  buildUtcTimeRange,
  generateShiftBuckets,
  IST_TIMEZONE,
} from "../../../utils/dateTimeUtils";
import type { ApiPayload } from "../../../types/Interfaces";
import {
  useCycleTimeQuery,
  useTimelineQuery,
} from "../../../hooks/Queries/useAnalyticsQueries";
import dayjs from "dayjs";
import { processTableData } from "../../../utils/tableProcessor";

export const useTableChartController = (activeFilters: ActiveFilterState) => {
  const ROWS = [
    { key: "total", label: "Total", suffix: "" },
    { key: "pass", label: "Pass", suffix: "" },
    { key: "fail", label: "Fail", suffix: "" },
    {
      key: "actualCycleTime",
      label: "Actual Cycle Time",
      suffix: " secs",
      isFloat: true,
    },
    {
      key: "idealCycleTime",
      label: "Ideal Cycle Time",
      suffix: " secs",
      isFloat: true,
    },
    { key: "runtime", label: "Runtime", suffix: " mins", isFloat: true },
    {
      key: "plannedDowntime",
      label: "Planned Downtime",
      suffix: " mins",
      isFloat: true,
    },
    {
      key: "minorStoppage",
      label: "Minor Stoppage",
      suffix: " mins",
      isFloat: true,
    },
    {
      key: "unknownDowntime",
      label: "Unknown Downtime",
      suffix: " mins",
      isFloat: true,
    },
    {
      key: "unplannedDowntime",
      label: "Unplanned Downtime",
      suffix: " mins",
      isFloat: true,
    },
    {
      key: "unplannedProduction",
      label: "Unplanned Production",
      suffix: " mins",
      isFloat: true,
    },
    {
      key: "unknownUnplannedProduction",
      label: "Unknown Unplanned Production",
      suffix: " mins",
      isFloat: true,
    },
  ];
  console.log({ activeFilters });
  const apiPayload = useMemo(() => {
    if (!activeFilters?.assetId) {
      return null;
    }

    const targetDate =
      activeFilters?.date ||
      dayjs().add(-1, "day").tz(IST_TIMEZONE).format("YYYY-MM-DD");
    const startTime = activeFilters?.shiftStartTime || "00:00";
    const endTime = activeFilters?.shiftEndTime || "23:59";

    const timeRange = buildUtcTimeRange(targetDate, startTime, endTime);

    const payload: ApiPayload = {
      entity_scope: {
        type: "asset",
        asset: {
          asset_id: activeFilters.assetId,
          asset_level_id: Number(activeFilters.assetLevelId),
        },
      },
      time_range: timeRange,
    };

    return payload;
  }, [activeFilters]);
console.log({ activeFilters})
  const timelinePayload = useMemo(() => {
    if (!apiPayload) return null;
    return {
      ...apiPayload,
      exact_produces: activeFilters?.exactProduces ,
      produce_counts: true,
      group_produce_counts_by_part_model: true,
    };
  }, [apiPayload, activeFilters?.exactProduces]);
  const {
    data: timelineData,
    isFetching: timelineFetching,
    error: timelineError,
  } = useTimelineQuery(timelinePayload);

  const {
    data: cycleData,
    isFetching: cycleFetching,
    error: cycleError,
  } = useCycleTimeQuery(
    apiPayload
      ? {
          ...apiPayload,
          distribution: "hourly",
          metrics: ["ideal_cycle_time_seconds", "actual_cycle_time_seconds"],
        }
      : null,
  );
  const tableData = useMemo(() => {
    if (!apiPayload || !apiPayload.time_range || !timelineData) return [];

    const buckets = generateShiftBuckets(
      apiPayload.time_range.from_ts,
      apiPayload.time_range.to_ts,
    );

    return processTableData(buckets, timelineData, cycleData);
  }, [apiPayload, timelineData, cycleData]);

  console.log({ tableData });
  return {
    ROWS,
    tableData,
  };
};
