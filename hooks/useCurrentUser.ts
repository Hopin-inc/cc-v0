import { useCallback, useEffect, useState } from "react";
import { UserProfile } from "@/types";
import { usersService } from "@/services/users";

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

  const fetchCurrentUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await usersService.getCurrentUser();
      setCurrentUser(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch user profile")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      fetchCurrentUser();
    }
  }, [currentUser]);

  return {
    refetch: fetchCurrentUser,
    currentUser,
    isLoading,
    error,
    isAuthenticated: !!currentUser,
  };
};
