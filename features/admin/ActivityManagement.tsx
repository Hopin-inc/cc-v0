"use client";

import { useEffect, useState } from "react";
import { useAdminActivity } from "@/hooks/admin/useAdminActivity";
import { useAdminContribution } from "@/hooks/admin/useAdminContribution";
import { useAdminContributionMutation } from "@/hooks/admin/useAdminContributionMutation";
import { useCurrentProject } from "@/hooks/useCurrentProject";
import { ActivityType, ContributionStatus, UserContribution } from "@/types";
import { toast } from "sonner";
import { ContributionsTable } from "./activity-management/ContributionsTable";

export const ActivityManagement = () => {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [contributions, setContributions] = useState<UserContribution[]>([]);
  const { currentProject } = useCurrentProject();

  const { fetchAll, isLoading: isActivityLoading } = useAdminActivity();
  const { fetchAll: fetchContributions, isLoading: isContributionFetchLoading } = useAdminContribution();
  const {
    updateActivity: updateContributionActivity,
    updateStatus: updateContributionStatus,
    isLoading: isContributionMutationLoading,
  } = useAdminContributionMutation();

  useEffect(() => {
    if (currentProject?.id) {
      loadData();
    }
  }, [currentProject?.id]);

  const loadData = async () => {
    if (!currentProject?.id) return;
    try {
      const [activitiesData, contributionsData] = await Promise.all([
        fetchAll(currentProject.id),
        fetchContributions(currentProject.id),
      ]);
      if (activitiesData) {
        // @ts-ignore
        setActivities(activitiesData);
      }
      if (contributionsData) {
        setContributions(contributionsData);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const handleActivityChange = async (
    contributionId: string,
    activityId: string
  ) => {
    try {
      await updateContributionActivity(contributionId, activityId);
      loadData();
      toast.success("活動を更新しました");
    } catch (error) {
      console.error("Failed to update activity:", error);
      toast.error("活動を更新できませんでした");
    }
  };

  const handleStatusChange = async (
    contributionId: string,
    status: ContributionStatus
  ) => {
    try {
      await updateContributionStatus(contributionId, status);
      loadData();
      toast.success("ステータスを更新しました");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("ステータスを更新できませんでした");
    }
  };

  if (!contributions.length || !activities.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">申請管理</h2>
      </div>
      <ContributionsTable
        contributions={contributions}
        activities={activities}
        isLoading={isContributionFetchLoading || isContributionMutationLoading || isActivityLoading}
        onActivityChange={handleActivityChange}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};
