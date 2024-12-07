import { useState } from "react";
import { adminContributionTypesService } from "@/services";
import { toast } from "sonner";

type CreateInput = {
  name: string;
  value: string;
  point?: number;
};

export const useAdminContributionTypeMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (data: CreateInput) => {
    setIsLoading(true);
    setError(null);

    try {
      await adminContributionTypesService.create(data);
      toast.success("活動種別を作成しました");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "活動種別の作成に失敗しました";
      toast.error(errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id: string, data: Partial<CreateInput>) => {
    setIsLoading(true);
    setError(null);

    try {
      await adminContributionTypesService.update(id, data);
      toast.success("活動種別を更新しました");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "活動種別の更新に失敗しました";
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
      await adminContributionTypesService.delete(id);
      toast.success("活動種別を削除しました");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "活動種別の削除に失敗しました";
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
