import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserProfile } from "@/types";
import { MoreHorizontal, Pencil, LogOut, Lock } from "lucide-react";
import { EditProfileModal } from "./EditProfileModal";
import { useCurrentUserContext } from "@/contexts/UserContext";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

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
  const { signOut } = useAuth();
  const router = useRouter();
  const isOwnProfile = currentUser?.id === userProfile?.id;

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const handlePasswordReset = () => {
    router.push("/auth/reset-password");
  };

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">メニューを開く</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px]">
                <DropdownMenuItem 
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer text-sm"
                >
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  プロフィールを編集
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handlePasswordReset}
                  className="text-muted-foreground hover:text-foreground cursor-pointer text-sm"
                >
                  <Lock className="h-3.5 w-3.5 mr-2" />
                  パスワード再設定
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground cursor-pointer text-sm"
                >
                  <LogOut className="h-3.5 w-3.5 mr-2" />
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
