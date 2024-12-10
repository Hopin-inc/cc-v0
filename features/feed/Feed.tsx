"use client";

import { ActivitySubmissionForm } from "@/features/activity";
import { IntegratedFeed } from "@/features/feed/IntegratedFeed";
import { ProjectOverviewCard } from "@/features/project";
import { useProjectRoute } from "@/hooks/useProjectRoute";

type FeedProps = {
  projectSlug: string;
};

export const Feed = ({ projectSlug }: FeedProps) => {
  useProjectRoute({ projectSlug, redirectPath: "feed" });

  return (
    <div className="mt-4 pb-20">
      <ProjectOverviewCard />
      <IntegratedFeed projectSlug={projectSlug} />
      <ActivitySubmissionForm />
    </div>
  );
};
