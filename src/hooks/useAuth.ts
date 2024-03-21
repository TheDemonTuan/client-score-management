import { useQuery } from "@tanstack/react-query";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { authVerify } from "@/api/auth";

export const useAuth = () => {
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

  return {
    authData,
    authError,
    authIsFetching,
    authIsPending,
    authIsLoading,
    authIsSuccess,
    authIsError,
    authRefetch,
    authCanUse: !authIsFetching && authIsSuccess && authData,
  };
};
