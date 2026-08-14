import { useMemo, useState } from "react";
import {
  useAssetQuery,
  useShiftsQuery,
} from "../../../../hooks/Queries/useCoreQueries";
import { flattenAssets, mapShifts } from "../../../../utils/mapper";

export const useFilterBarController = () => {
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
  const [filterState, setFilterState] = useState({
    assetId: "",
    shiftId: "",
    date: "",
  });
  const [exactProduces, setExactProduces] = useState<boolean>(false);

  const handleFilterState = ({
    key,
    value,
  }: {
    key: string;
    value: string;
  }): void => {
    setFilterState((prevState) => ({ ...prevState, [key]: value }));
  };

  const resetFilters = () => {
    setFilterState({
      assetId: "",
      shiftId: "",
      date: "",
    });
    setExactProduces(false);
  };
  const handleExactProducesChange = (value: boolean) => {
    setExactProduces(value);
  };

  return {
    filterState,
    flatAssets,
    dropdownShifts,
    assetsLoading,
    shiftsLoading,
    exactProduces,
    handleFilterState,
    resetFilters,
    handleExactProducesChange,
  };
};
