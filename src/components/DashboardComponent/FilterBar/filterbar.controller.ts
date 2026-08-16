import { useMemo, useState, useCallback, useEffect } from "react";
import {
  useAssetQuery,
  useShiftsQuery,
} from "../../../hooks/Queries/useCoreQueries";
import { flattenAssets, mapShifts } from "../../../utils/mapper";
import type { ActiveFilterState, FilterState } from "../../../types/types";

export const useFilterBarController = (
  onFilterChange?: (filterState: ActiveFilterState) => void,
) => {
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

  const [filterState, setFilterState] = useState<FilterState>({
    assetId: "",
    shiftId: "",
    date: "",
  });
  const [exactProduces, setExactProduces] = useState<boolean>(false);

  useEffect(() => {
    const payload: Partial<ActiveFilterState> = {};
    if (filterState?.assetId) {
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

    if (onFilterChange) {
      onFilterChange(payload);
    } else {
      console.warn("Failed");
    }
  }, [filterState, exactProduces, flatAssets, dropdownShifts, onFilterChange]);

  const handleFilterState = useCallback(
    ({ key, value }: { key: string; value: string }): void => {
      setFilterState((prevState) => ({ ...prevState, [key]: value }));
    },
    [],
  );

  const handleFilterChange = useCallback(
    (key: string, value: string | number | boolean): void => {
      handleFilterState({ key, value: String(value) });
    },
    [handleFilterState],
  );

  const handleExactProducesChange = useCallback((value: boolean) => {
    setExactProduces(value);
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState({
      assetId: "",
      shiftId: "",
      date: "",
    });
    setExactProduces(false);

    // if (onFilterChange) onFilterChange(null);
  }, []);
  return {
    filterState,
    flatAssets,
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
