import { useEffect, useState } from "react";
import { ProjectType } from "@/types";
import { projectsService } from "@/services/projects";
import { useCache } from "./useCache";

export const useProjects = () => {
  const [data, setData] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getCachedData } = useCache<ProjectType[]>("projects");

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

  return {
    data,
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
