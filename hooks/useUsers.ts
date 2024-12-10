import { useState, useEffect } from "react";
import { User, UserProfile } from "@/types";
import { usersService } from "@/services/users";
import { useCache } from "./useCache";

export const useUsers = () => {
  const [data, setData] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getCachedData } = useCache<User[]>("users");

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const users = await getCachedData(() => usersService.getUsers());
        // @ts-ignore
        setData(users);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch users")
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [getCachedData]);

  return {
    data,
    isLoading,
    error,
  };
};
