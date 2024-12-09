import { useState } from "react";
import { Badge } from "@/types";
import { badgesService } from "@/services/badges";
import { toast } from "sonner";

export const useAdminActivityBadgeMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const assignBadges = async (activityId: string, badges: Badge[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // 既存のバッジを全て削除
      const currentBadges = await badgesService.getActivityBadges(activityId);
      await Promise.all(
        currentBadges.map((ab) =>
          badgesService.removeBadgeFromActivity(activityId, ab.badge_id)
        )
      );

      // 選択されたバッジを追加
      await Promise.all(
        badges.map((badge) =>
          badgesService.assignBadgeToActivity(activityId, badge.id)
        )
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "バッジの更新に失敗しました";
      toast.error(errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    assignBadges,
    isLoading,
    error,
  };
};
