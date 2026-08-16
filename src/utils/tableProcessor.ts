// src/utils/tableProcessor.ts
import type { ProcessedHour, ShiftBucket } from "../types/Interfaces";

/**
 * Calculates how many minutes of a specific event segment overlap with a given hour bucket.
 */
const calculateOverlapMinutes = (
  bucketStartMs: number,
  bucketEndMs: number,
  segStartUtc: string,
  segEndUtc: string,
): number => {
  const segStartMs = new Date(segStartUtc).getTime();
  const segEndMs = new Date(segEndUtc).getTime();

  const overlapStart = Math.max(bucketStartMs, segStartMs);
  const overlapEnd = Math.min(bucketEndMs, segEndMs);

  if (overlapEnd > overlapStart) {
    return (overlapEnd - overlapStart) / (60 * 1000);
  }
  return 0;
};

export const processTableData = (
  buckets: ShiftBucket[],
  timelineData: any,
  cycleData: any,
): ProcessedHour[] => {
  if (!buckets || buckets.length === 0) return [];

  const runtimes = timelineData?.runtimes || [];
  const downtimes = timelineData?.downtimes || [];
  const stoppages = timelineData?.stoppages || [];
  const produces = timelineData?.produce_counts || [];

  const cycleMetrics = cycleData?.data || cycleData || [];

  return buckets.map((bucket) => {
    const row: ProcessedHour = {
      bucket,
      total: 0,
      pass: 0,
      fail: 0,
      actualCycleTime: null,
      idealCycleTime: null,
      runtime: 0,
      plannedDowntime: 0,
      minorStoppage: 0,
      unknownDowntime: 0,
      unplannedDowntime: 0,
      unplannedProduction: 0,
      unknownUnplannedProduction: 0,
    };

    produces.forEach((p: any) => {
      if (new Date(p.bucket_start).getTime() === bucket.startMs) {
        row.pass += p.ok_count || 0;
        row.fail += p.ng_count || 0;
        row.total += (p.ok_count || 0) + (p.ng_count || 0);
      }
    });

    cycleMetrics.forEach((c: any) => {
      if (new Date(c.bucket_start).getTime() === bucket.startMs) {
        row.idealCycleTime = c.ideal_cycle_time_seconds ?? 0;
        row.actualCycleTime = c.actual_cycle_time_seconds ?? 0;
      }
    });

    runtimes.forEach((seg: any) => {
      const mins = calculateOverlapMinutes(
        bucket.startMs ?? 0,
        bucket.endMs ?? 0,
        seg.start_at ?? 0,
        seg.end_at ?? 0,
      );
      if (mins > 0) {
        if (seg.type === "planned") {
          row.runtime += mins;
        } else if (seg.type === "unknown unplanned production") {
          row.unknownUnplannedProduction += mins;
        } else {
          row.runtime += mins; // Fallback for standard runtimes
        }
      }
    });

    downtimes.forEach((seg: any) => {
      const mins = calculateOverlapMinutes(
        bucket.startMs ?? 0,
        bucket.endMs ?? 0,
        seg.start_at ?? 0,
        seg.end_at ?? 0,
      );
      if (mins > 0) {
        if (seg.type === "unknown") row.unknownDowntime += mins;
        else if (seg.type === "planned") row.plannedDowntime += mins;
        else row.unplannedDowntime += mins;
      }
    });

    stoppages.forEach((seg: any) => {
      const mins = calculateOverlapMinutes(
        bucket.startMs ?? 0,
        bucket.endMs ?? 0,
        seg.start_at ?? 0,
        seg.end_at ?? 0,
      );
      if (mins > 0) {
        row.minorStoppage += mins;
      }
    });

    return row;
  });
};

export const formatValue = (
  value: number | null | undefined,
  isFloat?: boolean,
  suffix?: string,
  isElapsed?: boolean, // Optional: use this if you want to hide data for future hours
): string => {
  if (value === null || value === undefined) return "0 mins";

  if (!isElapsed && value === 0) return "0 mins";

  const formattedNumber = isFloat
    ? value.toFixed(1) // e.g., 45.2
    : Math.round(value).toString(); // e.g., 45

  return suffix ? `${formattedNumber}${suffix}` : formattedNumber;
};
