"use client";

import {
  ProjectStats,
  ProjectDescription,
  ProjectParticipants,
  ProjectTimeline,
} from "@/features/project";
import { useProjectRoute } from "@/hooks/useProjectRoute";

type ProjectPageProps = {
  projectSlug: string;
};

export const ProjectPage = ({ projectSlug }: ProjectPageProps) => {
  const { currentProject, isLoading } = useProjectRoute({
    projectSlug,
    redirectPath: "p",
  });

  return (
    <div className="space-y-8 mt-6 pb-20">
      <ProjectDescription isLoading={isLoading} project={currentProject} />
      <ProjectStats />
      <ProjectParticipants />
      <ProjectTimeline />
    </div>
  );
};
