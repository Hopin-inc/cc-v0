import { useState } from "react";
import { toast } from "sonner";
import { usersService } from "@/services/users";
import { storageService } from "@/services/storage";
import { useCurrentUserContext } from "@/contexts/UserContext";

export const useUserProfile = (userId: string) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { refetch } = useCurrentUserContext();

  const updateProfile = async ({
    name,
    bio,
  }: {
    name: string;
    bio: string;
  }) => {
    setIsUpdating(true);
    try {
      await usersService.updateProfile(userId, {
        name: name.trim(),
        bio: bio.trim(),
      });
      await refetch();
      toast.success("プロフィールを更新しました");
    } catch (error) {
      console.error(error);
      toast.error("プロフィールの更新に失敗しました");
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateThumbnail = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const thumbnailUrl = await storageService.uploadThumbnail(file, userId);
      await usersService.updateThumbnailUrl(userId, thumbnailUrl);
      toast.success("プロフィール画像を更新しました");
    } catch (error) {
      console.error(error);
      toast.error("プロフィール画像の更新に失敗しました");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    updateProfile,
    updateThumbnail,
    isUpdating,
    isUploading,
  };
};
