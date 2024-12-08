import { useState } from "react";
import { useStorage } from "@/hooks/useStorage";
import { usePhoto } from "@/hooks/usePhoto";
import { userContributionsService } from "@/services/userContributions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateRandomString } from "@/utils/string";
import { authService } from "@/services";

const DEFAULT_PROJECT_ID = "bd3a16b0-c11f-431a-ad58-67aad9043f1a";

export const useActivityApply = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [activityType, setActivityType] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { uploadPhoto } = useStorage();
  const { save: savePhoto } = usePhoto();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !activityType || !photo) {
      toast.error("必須項目を入力してください");
      return;
    }
    const dummyPassword = generateRandomString(12);

    try {
      setIsSubmitting(true);
      setError(null);

      const { user } = await authService.signUp(email, dummyPassword);

      if (!user) return;

      const createdUserContribution = await userContributionsService.create({
        type_id: activityType,
        // #TODO: 変えられるようにする
        project_id: DEFAULT_PROJECT_ID,
        user_id: user.id,
        status: "claimed",
      });

      // 2. Upload photo
      let photoUrl: string | undefined;

      if (photo) {
        photoUrl = await uploadPhoto(photo, user.id);
      }

      // 3. Save photo
      if (photoUrl && createdUserContribution) {
        await savePhoto({
          url: photoUrl,
          project_id: DEFAULT_PROJECT_ID,
          user_contibution_id: createdUserContribution.id,
          user_id: user.id,
        });
      }
      toast.success("活動を申請しました。メールをご確認ください。");
      router.push("/auth/verify-email");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "申請に失敗しました";
      toast.error(errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFile = (file: File) => {
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return {
    email,
    setEmail,
    activityType,
    setActivityType,
    setPhoto,
    photo,
    setPhotoPreview,
    photoPreview,
    isSubmitting,
    error,
    handleFile,
    handleSubmit,
  };
};
