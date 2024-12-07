import { useState, useEffect } from "react";
import { ContributionType } from "@/types";
import {
  adminContributionTypesService,
  contributionTypesService,
} from "@/services";

export const useContributionType = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ContributionType[]>([]);

  const fetchAll = async () => {
    setIsLoading(true);
    setError(null);

    try {
      return await adminContributionTypesService.fetchAll();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "活動種別の取得に失敗しました";
      setError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchTypes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await contributionTypesService.fetchAll();
        setData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "活動種別の取得に失敗しました";
        setError(err instanceof Error ? err : new Error(errorMessage));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTypes();
  }, []);

  return {
    isLoading,
    error,
    data,
    fetchAll,
  };
};
