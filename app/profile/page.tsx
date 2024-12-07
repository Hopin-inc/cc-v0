"use client";

import { useState } from "react";
import {
  ProfileHeader,
  ProfileStats,
  ProfileActivities,
} from "@/features/profile";
import { PointExchangeModal } from "@/features/activity";
import { Button } from "@/components/ui";
import { Coins } from "lucide-react";
import { useCurrentUserContext } from "@/contexts/UserContext";
import { withAuth } from "@/components/hoc/withAuth";

function Profile() {
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const { currentUser, isLoading } = useCurrentUserContext();

  return (
    <div className="space-y-6 mt-6 pb-32">
      <ProfileHeader isLoading={isLoading} userProfile={currentUser} />
      <ProfileStats isLoading={isLoading} userProfile={currentUser} />
      <ProfileActivities userId={currentUser?.id} />
      <Button
        onClick={() => setIsExchangeModalOpen(true)}
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 px-8 py-3 rounded-full shadow-lg flex items-center justify-center z-50 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 text-base shadow-md"
      >
        <Coins className="w-5 h-5 mr-2" />
        <span className="font-medium">ポイントを利用する</span>
      </Button>
      <PointExchangeModal
        isOpen={isExchangeModalOpen}
        onClose={() => setIsExchangeModalOpen(false)}
        title="ポイントを利用する"
      />
    </div>
  );
}

export default withAuth(Profile);
