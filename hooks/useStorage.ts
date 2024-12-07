import { useState } from "react";
import { storageService } from "@/services/storage";

export const useStorage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadPhoto = async (file: File, userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      storageService.validateFile(file);
      return await storageService.uploadPhoto(file, userId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "写真のアップロードに失敗しました";
      setError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    uploadPhoto,
  };
};
