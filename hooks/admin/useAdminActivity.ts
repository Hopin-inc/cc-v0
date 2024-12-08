import { useState } from "react";
import { adminActivitiesService } from "@/services";
import { Activity } from "@/types";

export const useAdminActivity = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = async (
    projectId: string,
    type?: string
  ): Promise<Activity[]> => {
    setIsLoading(true);
    setError(null);

    try {
      return await adminActivitiesService.fetchAll(projectId, type);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "活動の取得に失敗しました";
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
