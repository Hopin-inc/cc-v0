import { ProjectType } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { projectsService } from "@/services/projects";

type ReturnType = {
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

  const fetchProject = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectsService.getCurrentProject();
      setCurrentProject(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch project")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!currentProject) {
      fetchProject();
    }
  }, [currentProject]);

  return {
    currentProject,
    isLoading,
    error,
    refetch: fetchProject,
  };
};
