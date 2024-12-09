import { useState } from "react";
import { ActivityType } from "@/types";
import { TablesInsert } from "@/types/supabase";
import { adminActivitiesService } from "@/services";
import { toast } from "sonner";

export const useAdminActivityMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (input: TablesInsert<"activities">) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await adminActivitiesService.create(input);
      toast.success("活動を作成しました");
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "活動の作成に失敗しました";
      toast.error(errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id: string, input: Partial<ActivityType>) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await adminActivitiesService.update(id, input);
      toast.success("活動を更新しました");
      return { id };
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

  const remove = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await adminActivitiesService.delete(id);
      toast.success("活動を削除しました");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "活動の削除に失敗しました";
      toast.error(errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    create,
    update,
    remove,
  };
};
