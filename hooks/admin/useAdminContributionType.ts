import { useState } from "react";
import { adminContributionTypesService } from "@/services";

export const useAdminContributionType = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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

  return {
    isLoading,
    error,
    fetchAll,
  };
};
