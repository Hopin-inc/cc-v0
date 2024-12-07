import { useState } from "react";
import { userPhotoService } from "@/services/userPhotos";
import { TablesInsert } from "@/types/supabase";

export const usePhoto = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const save = async (input: TablesInsert<"user_photos">) => {
    setIsLoading(true);
    setError(null);

    try {
      return await userPhotoService.save(input);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "写真の保存に失敗しました";
      setError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    save,
  };
};
