"use client";

import { Card } from "@/components/ui";
import Link from "next/link";
import { ArrowUpRight, Users, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectType } from "@/types";
import { FeedItem } from "@/types";
import { calculateTotalParticipants } from "@/utils/calculateTotalParticipants";
import { useProjectPoints } from "@/hooks/useProjectPoints";

type ProjectCardProps = {
  project: ProjectType;
  feedItems: FeedItem[];
};

export function ProjectCard({ project, feedItems }: ProjectCardProps) {
  const { totalPoints } = useProjectPoints(project.id);
  const projectFeedItems = feedItems.filter(
    (item) => item.project_id === project.id
  );
  const totalParticipants = calculateTotalParticipants(projectFeedItems);

  return (
    <Link href={`/p/${project.id}`} className="group">
      <Card className="relative p-6 hover:bg-muted/50 transition-all duration-200 hover:shadow-md">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg group-hover:text-primary truncate">
              {project.name}
            </h3>
            <ArrowUpRight className="w-5 h-5 text-muted-foreground/0 group-hover:text-primary transition-all duration-200 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description || "説明はまだありません"}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="weak-secondary"
                className="flex items-center gap-1"
              >
                <Users className="w-3.5 h-3.5" />
                {totalParticipants} 人
              </Badge>
              <Badge
                variant="weak-secondary"
                className="flex items-center gap-1"
              >
                <Trophy className="w-3.5 h-3.5" />
                {totalPoints} pt
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
