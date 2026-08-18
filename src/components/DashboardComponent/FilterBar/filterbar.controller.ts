import { useMemo, useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  useAssetQuery,
  useShiftsQuery,
} from "../../../hooks/Queries/useCoreQueries";
import { flattenAssets, mapShifts } from "../../../utils/mapper";
import type { ActiveFilterState, FilterState } from "../../../types/types";

dayjs.extend(utc);
dayjs.extend(timezone);
const IST_TIMEZONE = "Asia/Kolkata";

export const useFilterBarController = (
  onFilterChange?: (filterState: ActiveFilterState) => void,
) => {
  const [filterState, setFilterState] = useState<FilterState>({
    assetId: "",
    shiftId: "",
    date: "",
    assetLevel: "all",
  });

  const [exactProduces, setExactProduces] = useState<boolean>(false);

  const { data: assetsData, isLoading: assetsLoading } = useAssetQuery();
  const { data: shiftsData, isLoading: shiftsLoading } = useShiftsQuery();

  const flatAssets = useMemo(
    () => flattenAssets(assetsData?.data || []),
    [assetsData],
  );

  const dropdownShifts = useMemo(
    () => mapShifts(shiftsData?.data || []),
    [shiftsData],
  );

  const uniqueLevels = useMemo(() => {
    const levels = Array.from(new Set(flatAssets.map((a) => a.assetLevelId)));
    const options = levels
      .sort((a, b) => a - b)
      .map((level) => ({
        id: level,
        name: `Level ${level}`,
        label: `Level ${level}`,
      }));
    return [{ id: "all", name: "All levels" }, ...options];
  }, [flatAssets]);

  const filteredAssets = useMemo(() => {
    if (filterState.assetLevel === "all") return flatAssets;
    else {
      const options = flatAssets
        .filter(
          (a) => String(a.assetLevelId) === String(filterState.assetLevel),
        )
        .map((asset) => ({
          id: asset.id,
          name: asset.name,
        }));
      return options;
    }
  }, [flatAssets, filterState.assetLevel]);

  const handleFilterState = useCallback(
    ({ key, value }: { key: string; value: string | number }): void => {
      setFilterState((prevState) => ({ ...prevState, [key]: value }));
    },
    [],
  );

  useEffect(() => {
    queueMicrotask(() => {
      setFilterState((prev) => {
        if (filteredAssets.length > 0) {
          const isCurrentAssetValid = filteredAssets.some(
            (a) => a.id === prev.assetId,
          );
          if (!isCurrentAssetValid) {
            return { ...prev, assetId: filteredAssets[0].id };
          }
        } else if (prev.assetId !== "") {
          return { ...prev, assetId: "" };
        }
        return prev;
      });
    });
  }, [filteredAssets]);

  useEffect(() => {
    queueMicrotask(() => {
      setFilterState((prev) => {
        const updates: Partial<FilterState> = {};
        let hasUpdates = false;

        if (dropdownShifts.length > 0 && !prev.shiftId) {
          const firstShift = dropdownShifts[0];
          updates.shiftId = `${firstShift.shiftId}`;
          hasUpdates = true;
        }

        if (!prev.date) {
          updates.date = dayjs()
            .add(-1, "day")
            .tz(IST_TIMEZONE)
            .format("YYYY-MM-DD");
          hasUpdates = true;
        }

        return hasUpdates ? { ...prev, ...updates } : prev;
      });
    });
  }, [dropdownShifts]);

  useEffect(() => {
    const payload: Partial<ActiveFilterState> = {};

    if (filterState.assetId) {
      const selectedAsset = flatAssets.find(
        (a) => a.id === filterState.assetId,
      );
      if (selectedAsset) {
        payload.assetId = selectedAsset.id;
        payload.assetLevelId = String(selectedAsset.assetLevelId);
      }
    }

    if (filterState.shiftId) {
      const selectedShift = dropdownShifts.find(
        (s) => s.shiftId === filterState.shiftId,
      );
      if (selectedShift) {
        const [pureApiShiftId] = selectedShift.shiftId.split("|");
        payload.shiftId = pureApiShiftId;
        payload.shiftStartTime = selectedShift.startTime;
        payload.shiftEndTime = selectedShift.endTime;
      }
    }

    if (filterState.date) payload.date = filterState.date;
    payload.exactProduces = exactProduces;

    if (payload.assetId && payload.shiftId && payload.date && onFilterChange) {
      onFilterChange(payload as ActiveFilterState);
    }
  }, [filterState, exactProduces, flatAssets, dropdownShifts, onFilterChange]);

  const handleFilterChange = useCallback(
    (key: string, value: string | number | boolean): void => {
      handleFilterState({ key, value: String(value) });
    },
    [handleFilterState],
  );

  const handleExactProducesChange = useCallback(
    (value: boolean) => {
      setExactProduces(value);
      handleFilterChange("exactProduces", value);
    },
    [handleFilterChange],
  );

  const resetFilters = useCallback(() => {
    setFilterState({
      assetId: filteredAssets[0]?.id,
      shiftId: dropdownShifts[0]?.shiftId,
      date: dayjs().add(-1, "day").tz(IST_TIMEZONE).format("YYYY-MM-DD"),
      assetLevel: "all",
    });
    setExactProduces(false);
  }, [filteredAssets, dropdownShifts]);
  return {
    filterState,
    flatAssets,
    filteredAssets, // Make sure your UI uses this array for the Asset dropdown!
    uniqueLevels, // Use this for your new Asset Level dropdown
    dropdownShifts,
    assetsLoading,
    shiftsLoading,
    exactProduces,
    handleFilterState,
    handleFilterChange,
    resetFilters,
    handleExactProducesChange,
  };
};
