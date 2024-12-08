"use client";

import {
  ProjectStats,
  ProjectDescription,
  ProjectParticipants,
  ProjectTimeline,
} from "@/features/project";
import { useCurrentProject } from "@/hooks/useCurrentProject";

export default function Project() {
  const { currentProject, isLoading } = useCurrentProject();

  return (
    <div className="space-y-8 mt-6 pb-20">
      <ProjectDescription isLoading={isLoading} project={currentProject} />
      <ProjectStats />
      <ProjectParticipants />
      <ProjectTimeline />
    </div>
  );
}
