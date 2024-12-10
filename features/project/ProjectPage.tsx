"use client";

import { useCurrentProjectContext } from "@/contexts/ProjectContext";
import {
  ProjectStats,
  ProjectDescription,
  ProjectParticipants,
  ProjectTimeline,
} from "@/features/project";
import { useFeedState } from "@/hooks/useFeedState";
import { useProjectRoute } from "@/hooks/useProjectRoute";

type ProjectPageProps = {
  projectSlug: string;
};

export const ProjectPage = ({ projectSlug }: ProjectPageProps) => {
  const { currentProject, isLoading } = useProjectRoute({
    projectSlug,
    redirectPath: "p",
  });
  const { feedItems } = useFeedState(currentProject?.id);

  return (
    <div className="space-y-8 mt-6 pb-20">
      <ProjectDescription isLoading={isLoading} project={currentProject} />
      <ProjectStats feedItems={feedItems} />
      <ProjectParticipants feedItems={feedItems} />
      <ProjectTimeline feedItems={feedItems} />
    </div>
  );
};
