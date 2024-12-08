"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ProfileHeader,
  ProfileStats,
  ProfileActivities,
} from "@/features/profile";
import { PointExchangeModal } from "@/features/activity";
import { Button } from "@/components/ui";
import { Coins } from "lucide-react";
import { usersService } from "@/services/users";
import { UserProfile } from "@/types";
import { useCurrentUserContext } from "@/contexts/UserContext";

function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const { currentUser } = useCurrentUserContext();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        setIsLoading(true);
        if (isOwnProfile) {
          setUser(currentUser);
        } else {
          const userData = await usersService.getUser(userId);
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, currentUser, isOwnProfile]);

  return (
    <div className="space-y-6 mt-6 pb-32">
      <ProfileHeader isLoading={isLoading} userProfile={user} />
      <ProfileStats isLoading={isLoading} userProfile={user} />
      <ProfileActivities userId={userId} />
      {isOwnProfile && (
        <>
          <Button
            onClick={() => setIsExchangeModalOpen(true)}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 px-8 py-3 rounded-full shadow-lg flex items-center justify-center z-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-200 text-base"
          >
            <Coins className="w-5 h-5 mr-2" />
            <span className="font-medium">ポイントを利用する</span>
          </Button>
          <PointExchangeModal
            isOpen={isExchangeModalOpen}
            onClose={() => setIsExchangeModalOpen(false)}
            title="ポイントを利用する"
          />
        </>
      )}
    </div>
  );
}

export default UserProfilePage;
