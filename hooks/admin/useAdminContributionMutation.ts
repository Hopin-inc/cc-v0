import { useState } from "react";
import { ContributionStatus } from "@/types";
import { adminUserContributionsService } from "@/services/admin/userContributions";
import { toast } from "sonner";

export const useAdminContributionMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateActivity = async (contributionId: string, activityId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await adminUserContributionsService.associateActivity(
        contributionId,
        activityId
      );
      toast.success("活動を更新しました");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "活動の更新に失敗しました";
      toast.error(errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (
    contributionId: string,
    status: ContributionStatus
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      if (status === "approved") {
        await adminUserContributionsService.approveContribution(contributionId);
        toast.success("申請を承認しました");
      } else {
        await adminUserContributionsService.updateStatus(
          contributionId,
          status
        );
        toast.success("ステータスを更新しました");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "ステータスの更新に失敗しました";
      toast.error(errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (contributionId: string) => {
    setIsLoading(true);
    try {
      await adminUserContributionsService.remove(contributionId);
      toast.success("申請を削除しました");
    } catch (err) {
      console.error(err);
      toast.error("申請の削除に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    updateActivity,
    updateStatus,
    remove,
  };
};
