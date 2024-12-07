import { useState } from "react";
import { adminUserContributionsService } from "@/services/admin/userContributions";

export const useAdminContribution = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = async (projectId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      return await adminUserContributionsService.fetchAll(projectId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "活動記録の取得に失敗しました";
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
