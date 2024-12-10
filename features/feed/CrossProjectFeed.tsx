"use client";

import { ActivitySubmissionForm } from "@/features/activity";
import { IntegratedFeed } from "@/features/feed/IntegratedFeed";

export const CrossProjectFeed = () => {
  return (
    <div className="mt-4 pb-20">
      <IntegratedFeed />
      <ActivitySubmissionForm />
    </div>
  );
};
