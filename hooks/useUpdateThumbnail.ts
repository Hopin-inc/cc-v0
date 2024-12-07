import { useState } from "react";
import { toast } from "sonner";
import { storageService } from "@/services/storage";
import { usersService } from "@/services/users";
import { useCurrentUserContext } from "@/contexts/UserContext";

export const useUpdateThumbnail = (userId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const { refetch } = useCurrentUserContext();

  const updateThumbnail = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      // Validate file
      storageService.validateFile(file);

      // Upload thumbnail to storage
      const thumbnailUrl = await storageService.uploadThumbnail(file, userId);

      // Update user's thumbnail_url
      await usersService.updateThumbnailUrl(userId, thumbnailUrl);

      toast.success("プロフィール画像を更新しました");

      // Refetch user data
      await refetch();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("画像のアップロードに失敗しました");
      }
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    updateThumbnail,
    isUploading,
  };
};
