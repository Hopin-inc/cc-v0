"use client";

import { useState } from "react";
import { useCurrentProjectContext } from "@/contexts/ProjectContext";
import { useCurrentUserContext } from "@/contexts/UserContext";
import { userContributionsService } from "@/services/userContributions";
import { useStorage } from "@/hooks/useStorage";
import { usePhoto } from "@/hooks/usePhoto";
import { toast } from "sonner";

export const useActivitySubmission = () => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { currentProject } = useCurrentProjectContext();
  const { currentUser } = useCurrentUserContext();
  const { uploadPhoto, isLoading: isUploading } = useStorage();
  const { save: savePhoto } = usePhoto();

  const isLoading = isCreating || isUploading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedType || !currentProject?.id || !currentUser?.id) {
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      const createdUserContribution = await userContributionsService.create({
        type_id: selectedType,
        project_id: currentProject.id,
        user_id: currentUser.id,
      });

      if (photos.length > 0 && createdUserContribution) {
        // 写真を並行してアップロード
        const uploadPromises = photos.map(async (photo) => {
          const photoUrl = await uploadPhoto(photo, currentUser.id);
          if (photoUrl) {
            await savePhoto({
              url: photoUrl,
              project_id: currentProject.id,
              user_contibution_id: createdUserContribution.id,
              user_id: currentUser.id,
            });
          }
        });

        await Promise.all(uploadPromises);
      }

      setIsSubmitted(true);
      toast.success("活動を投稿しました");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "活動の投稿に失敗しました";
      toast.error(errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setSelectedType("");
    setPhotos([]);
    setIsSubmitted(false);
    setError(null);
  };

  return {
    selectedType,
    setSelectedType,
    isSubmitted,
    isLoading,
    setPhotos,
    error,
    handleSubmit,
    resetForm,
  };
};
