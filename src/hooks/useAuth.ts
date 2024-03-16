import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { authVerify } from "@/api/auth";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const {
    data: authData,
    error: authError,
    isSuccess: authIsSuccess,
    isError: authIsError,
    isFetching: authIsFetching,
    isPending: authIsPending,
    isLoading: authIsLoading,
    refetch: authRefetch,
  } = useQuery<ApiSuccessResponse<UserResponse>, ApiErrorResponse, UserResponse>({
    queryKey: ["auth"],
    queryFn: async () => await authVerify(),
    select: (res) => res?.data,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 0,
  });

  if (authIsError) {
    if (queryClient.getQueryData(["auth"])) {
      queryClient.resetQueries({
        queryKey: ["auth"],
      });
    }
  }

  return {
    authData,
    authError,
    authIsFetching,
    authIsPending,
    authIsLoading,
    authIsSuccess,
    authIsError,
    authRefetch,
  };
};
