import { useState } from "react";
import type { ActiveFilterState } from "../../types/types";

export const useDashboardController = () => {
  const [activeFilters, setActiveFilters] = useState<ActiveFilterState | null>(
    null,
  );

  const handleFilterChange = (filters: ActiveFilterState): void => {
  
    setActiveFilters(filters);
  };

  return {
    activeFilters,
    handleFilterChange,
  };
};
