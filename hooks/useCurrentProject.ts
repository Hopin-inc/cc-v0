import { ProjectType } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { projectsService } from "@/services/projects";
import { useCache } from "./useCache";

type ReturnType = {
  setCurrentProject: (project: ProjectType) => void;
  currentProject: ProjectType | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export const useCurrentProject = (): ReturnType => {
  const [currentProject, setCurrentProject] = useState<ProjectType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getCachedData, invalidateCache } =
    useCache<ProjectType>("current-project");

  const fetchProject = useCallback(
    async (forceFetch = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCachedData(
          () => projectsService.getCurrentProject(),
          forceFetch
        );
        setCurrentProject(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch project")
        );
      } finally {
        setIsLoading(false);
      }
    },
    [getCachedData]
  );

  useEffect(() => {
    fetchProject();
  }, []);

  return {
    setCurrentProject,
    currentProject,
    isLoading,
    error,
    refetch: () => {
      invalidateCache();
      return fetchProject(true);
    },
  };
};
