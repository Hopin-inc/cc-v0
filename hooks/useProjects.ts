import { useEffect, useMemo, useState } from "react";
import { ProjectType } from "@/types";
import { projectsService } from "@/services/projects";
import { useCache } from "./useCache";
import { useCurrentUserContext } from "@/contexts/UserContext";

export const useProjects = () => {
  const [data, setData] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getCachedData } = useCache<ProjectType[]>("projects");
  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const projects = await getCachedData(() =>
          projectsService.getProjects()
        );
        setData(projects);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch projects")
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const sortedProjects = useMemo(() => {
    if (!data) return [];
    // ユーザーに紐づいているプロジェクトを先頭にする
    const userProjectIds = currentUser?.projects?.map((p) => p.id) ?? [];
    const sortedProjects = data.sort((a, b) => {
      const isUserProjectA = userProjectIds.includes(a.id) ?? false;
      const isUserProjectB = userProjectIds.includes(b.id) ?? false;
      if (isUserProjectA && !isUserProjectB) return -1;
      if (!isUserProjectA && isUserProjectB) return 1;
      return 0;
    });
    return sortedProjects;
  }, [data, currentUser?.projects]);

  return {
    data: sortedProjects,
    isLoading,
    error,
  };
};

export const useProject = (projectId: string) => {
  const [data, setData] = useState<ProjectType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      setIsLoading(true);
      try {
        const project = await projectsService.getProjectById(projectId);
        setData(project);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch project")
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  return { data, error, isLoading };
};

export const useProjectSearch = (query: string) => {
  const [data, setData] = useState<ProjectType[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchProjects = async () => {
      if (!query) return;
      setIsLoading(true);
      try {
        const projects = await projectsService.searchProjects(query);
        setData(projects);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to search projects")
        );
      } finally {
        setIsLoading(false);
      }
    };
    searchProjects();
  }, [query]);

  return { data, error, isLoading };
};
