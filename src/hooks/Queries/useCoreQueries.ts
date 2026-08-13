import { useQuery } from "@tanstack/react-query";
import { coreAPI } from "../../networkManager";

export const useAssetQuery = () => {
  return useQuery({
    queryKey: ["asset"],
    queryFn: () => coreAPI.getAssets(),
    staleTime: Infinity,
  });
};

export const useShiftsQuery = () => {
  return useQuery({
    queryKey: ["shifts"],
    queryFn: () => coreAPI.getShifts(),
    staleTime: Infinity,
  });
};
