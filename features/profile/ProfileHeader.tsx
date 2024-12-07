import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfile } from "@/types";
import { Pencil } from "lucide-react";
import { EditProfileModal } from "./EditProfileModal";
import { useCurrentUserContext } from "@/contexts/UserContext";

type ProfileHeaderProps = {
  userProfile: UserProfile | null;
  isLoading?: boolean;
};

export const ProfileHeader = ({
  userProfile,
  isLoading,
}: ProfileHeaderProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { currentUser } = useCurrentUserContext();
  const isOwnProfile = currentUser?.id === userProfile?.id;

  if (isLoading) {
    return (
      <div className="flex items-start space-x-6">
        <div className="relative">
          <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
          <Skeleton className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-5 w-16 rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div className="flex items-start space-x-6">
      <div className="relative">
        <Avatar className="w-24 h-24 border-4 border-background">
          <AvatarImage src={userProfile.thumbnail_url ?? ""} />
          <AvatarFallback>
            {userProfile.name?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold">{userProfile.name}</h1>
          {isOwnProfile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">プロフィールを編集</span>
            </Button>
          )}
        </div>
        {userProfile.bio && (
          <p className="text-sm text-muted-foreground">{userProfile.bio}</p>
        )}
      </div>

      {isOwnProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialValues={{
            name: userProfile.name ?? "",
            bio: userProfile.bio ?? "",
            thumbnailUrl: userProfile.thumbnail_url ?? "",
          }}
          userId={userProfile.id}
        />
      )}
    </div>
  );
};
