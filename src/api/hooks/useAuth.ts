import { useQuery } from "@tanstack/react-query";
import { ApiErrorResponse } from "@/lib/http";
import { verifyAuth } from "@/api/auth";

export const useAuth = () => {
  const {
    data: authData,
    error: authError,
    isSuccess: authIsSuccess,
    isError: authIsError,
    isFetching: authIsFetching,
    isPending: authIsPending,
    isLoading: authIsLoading,
  } = useQuery<UserResponse, ApiErrorResponse>({
    queryKey: ["auth"],
    queryFn: async () => await verifyAuth(),
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
  };
};
