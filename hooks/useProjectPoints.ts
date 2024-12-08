import { useEffect, useState } from "react";
import { projectsService } from "@/services/projects";
import { useCache } from "./useCache";

interface UseProjectPointsResult {
  totalPoints: number;
  isLoading: boolean;
  error: Error | null;
}

export function useProjectPoints(
  projectId: string | null
): UseProjectPointsResult {
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { getCachedData } = useCache<number>(`project-points-${projectId}`);

  useEffect(() => {
    let isMounted = true;

    async function getPoints() {
      if (!projectId) {
        setTotalPoints(0);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const points = await getCachedData(async () =>
          projectsService.getTotalDistributionPoints(projectId)
        );
        if (isMounted) {
          setTotalPoints(points);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("Unknown error occurred")
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    getPoints();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  return { totalPoints, isLoading, error };
}
