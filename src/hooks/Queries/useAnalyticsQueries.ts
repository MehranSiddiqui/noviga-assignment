import { useQuery } from "@tanstack/react-query";
import { analyticsAPI } from "../../networkManager";
import type { ApiPayload } from "../../types/Interfaces";

export const useTimelineQuery = (payload: ApiPayload | null) => {
  return useQuery({
    queryKey: ["timeline", payload],
    queryFn: async () => {
      const response = await analyticsAPI.postTimeline(payload);
      return response.data;
    },
    enabled: !!payload,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCycleTimeQuery = (payload: ApiPayload | null) => {
  return useQuery({
    queryKey: ["cycleTime", payload],
    queryFn: async () => {
      const response = await analyticsAPI.postCycleTime(payload);
      return response.data;
    },
    enabled: !!payload,
    staleTime: 5 * 60 * 1000,
  });
};
