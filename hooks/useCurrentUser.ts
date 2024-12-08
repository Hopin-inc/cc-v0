import { useCallback, useEffect, useState } from "react";
import { UserProfile } from "@/types";
import { usersService } from "@/services/users";
import { useCache } from "./useCache";

type ReturnType = {
  refetch: () => Promise<void>;
  currentUser: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
};

export const useCurrentUser = (): ReturnType => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getCachedData, invalidateCache } =
    useCache<UserProfile>("current-user");

  const fetchCurrentUser = useCallback(
    async (forceFetch = false) => {
      setIsLoading(true);
      try {
        const data = await getCachedData(
          () => usersService.getCurrentUser(),
          forceFetch
        );
        setCurrentUser(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch user profile")
        );
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    },
    [getCachedData]
  );

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return {
    refetch: () => {
      invalidateCache();
      return fetchCurrentUser(true);
    },
    currentUser,
    isLoading,
    error,
    isAuthenticated: !!currentUser,
  };
};
