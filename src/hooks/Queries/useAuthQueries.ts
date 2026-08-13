import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { authAPI } from "../../networkManager";

export const useUserQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authAPI.getUser(),
    enabled,
    retry: false,
  });
};
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      authAPI.login(data),
  });
};
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
