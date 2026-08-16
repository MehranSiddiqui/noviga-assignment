import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { ShiftBucket } from "../types/Interfaces";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
export const IST_TIMEZONE = "Asia/Kolkata";

export function buildUtcTimeRange(
  dateStr: string,
  startTime: string,
  endTime: string,
): { from_ts: string; to_ts: string } {
  const startIst = dayjs.tz(
    `${dateStr} ${startTime}`,
    "YYYY-MM-DD HH:mm",
    IST_TIMEZONE,
  );
  let endIst = dayjs.tz(
    `${dateStr} ${endTime}`,
    "YYYY-MM-DD HH:mm",
    IST_TIMEZONE,
  );

  // Check for midnight crossing (e.g., 19:00 -> 08:30) and add a day if needed
  if (endIst.isSameOrBefore(startIst)) {
    endIst = endIst.add(1, "day");
  }

  return {
    from_ts: startIst.utc().format(),
    to_ts: endIst.utc().format(),
  };
}

export function formatUtcToIst(
  utcString: string,
  format: string = "HH:mm",
): string {
  if (!utcString) return "";

  // Used to format string just in case 'dd' was passed instead of 'DD'
  const normalizedFormat = format.replace("dd", "DD");

  return dayjs.utc(utcString).tz(IST_TIMEZONE).format(normalizedFormat);
}

/**
 * Generates shift hour buckets (in IST) based on the shift start and end UTC timestamps.
 * Dynamically handles the last partial bucket (e.g. 18:30 - 19:00).
 */
export function generateShiftBuckets(
  fromUtc: string,
  toUtc: string,
): ShiftBucket[] {
  const start = dayjs.utc(fromUtc);
  const end = dayjs.utc(toUtc);
  const now = dayjs.utc();

  const buckets: ShiftBucket[] = [];
  let currentStart = start;
  let index = 0;

  while (currentStart.isBefore(end)) {
    let currentEnd = currentStart.add(1, "hour");

    if (currentEnd.isAfter(end)) {
      currentEnd = end;
    }

    const durationMinutes = currentEnd.diff(currentStart, "minute");

    const startIstLabel = currentStart.tz(IST_TIMEZONE).format("HH:mm");
    const endIstLabel = currentEnd.tz(IST_TIMEZONE).format("HH:mm");

    buckets.push({
      index,
      startUtc: currentStart.format(),
      endUtc: currentEnd.format(),
      startMs: currentStart.valueOf(),
      endMs: currentEnd.valueOf(),
      startIstLabel,
      endIstLabel,
      label: `${startIstLabel} - ${endIstLabel}`,
      durationMinutes,
      isElapsed: currentStart.isBefore(now),
    });

    currentStart = currentEnd;
    index++;
  }

  return buckets;
}
