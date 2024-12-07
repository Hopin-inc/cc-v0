"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ProfileHeader,
  ProfileStats,
  ProfileActivities,
} from "@/features/profile";
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

  useEffect(() => {
    if (currentUser?.id === userId) {
      router.push("/profile");
      return;
    }

    const fetchUser = async () => {
      if (!userId) return;
      try {
        setIsLoading(true);
        const userData = await usersService.getUser(userId);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, currentUser?.id, router]);

  return (
    <div className="space-y-6 mt-6 pb-32">
      <ProfileHeader isLoading={isLoading} userProfile={user} />
      <ProfileStats isLoading={isLoading} userProfile={user} />
      <ProfileActivities userId={userId} />
    </div>
  );
}

export default UserProfilePage;
