import { useRouter } from "next/navigation";
import { useCurrentProjectContext } from "@/contexts/ProjectContext";
import { useProjects } from "@/hooks/useProjects";
import { DEFAULT_PROJECT } from "@/config";
import { useEffect } from "react";

type UseProjectRouteProps = {
  projectSlug: string;
  redirectPath: "p" | "feed";
};

export const useProjectRoute = ({
  projectSlug,
  redirectPath,
}: UseProjectRouteProps) => {
  const router = useRouter();
  const { data: projects } = useProjects();
  const { currentProject, setCurrentProject, isLoading } =
    useCurrentProjectContext();

  useEffect(() => {
    if (!projects.length) return;
    const project = projects.find((p) => p.slug === projectSlug);
    if (!project) {
      router.replace(`/${redirectPath}/${DEFAULT_PROJECT.slug}`);
      return;
    }
    if (currentProject?.slug !== projectSlug) {
      setCurrentProject(project);
    }
  }, [projectSlug, projects, redirectPath]);

  return {
    currentProject,
    isLoading,
  };
};
