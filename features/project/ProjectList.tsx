"use client";

import { useProjects } from "@/hooks/useProjects";
import { useFeedState } from "@/hooks/useFeedState";
import { ProjectCard } from "./ProjectCard";
import { useMemo } from "react";
import { calculateTotalParticipants } from "@/utils/calculateTotalParticipants";

export function ProjectList() {
  const { data: projects } = useProjects();
  const { feedItems } = useFeedState();

  const sortedProjects = useMemo(() => {
    if (!projects) return [];
    return [...projects].sort((a, b) => {
      const projectAFeedItems = feedItems.filter(
        (item) => item.project_id === a.id
      );
      const projectBFeedItems = feedItems.filter(
        (item) => item.project_id === b.id
      );
      const participantsA = calculateTotalParticipants(projectAFeedItems);
      const participantsB = calculateTotalParticipants(projectBFeedItems);
      return participantsB - participantsA;
    });
  }, [projects, feedItems]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-muted-foreground">
        プロジェクト一覧
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {sortedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            feedItems={feedItems}
          />
        ))}
      </div>
    </div>
  );
}
