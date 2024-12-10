"use client";

import { Card } from "@/components/ui/card";
import { useFeedState } from "@/hooks/useFeedState";
import { useCurrentProjectContext } from "@/contexts/ProjectContext";
import CountUp from "react-countup";
import { calculateTotalParticipants } from "@/utils/calculateTotalParticipants";
import { useProjectPoints } from "@/hooks/useProjectPoints";
import { Users, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedItem } from "@/types";

type ProjectStatsProps = {
  feedItems: FeedItem[];
};

export function ProjectStats({ feedItems }: ProjectStatsProps) {
  const { currentProject } = useCurrentProjectContext();
  const totalParticipants = calculateTotalParticipants(feedItems);
  const { totalPoints, isLoading, error } = useProjectPoints(
    currentProject?.id || null
  );

  const stats = [
    {
      title: "総動員数",
      value: totalParticipants,
      unit: "人",
      icon: Users,
    },
    {
      title: "総配布ポイント数",
      value: isLoading ? 0 : totalPoints,
      unit: "pt",
      icon: Award,
      isLoading,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="flex flex-col justify-between p-3 pb-2 shadow-sm border-muted bg-gradient-to-b from-card to-muted/20"
        >
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-primary/5 rounded-full">
              <stat.icon className="h-4 w-4 text-primary/80" />
            </div>
            <p className="text-sm font-medium text-muted-foreground/80">
              {stat.title}
            </p>
          </div>
          <div className="mt-1 pl-9 mb-1">
            <div className="text-base font-bold text-foreground flex items-baseline">
              {stat.isLoading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <CountUp
                  end={stat.value}
                  duration={2}
                  separator=","
                  suffix={stat.unit}
                  enableScrollSpy
                  scrollSpyOnce
                />
              )}
            </div>
            {/* <p className="text-sm font-medium text-green-600">
              {" "}
              {stat.change}
              <span className="text-[10px] text-muted-foreground ml-1">
                先月比
              </span>
            </p> */}
          </div>
        </Card>
      ))}
    </div>
  );
}
