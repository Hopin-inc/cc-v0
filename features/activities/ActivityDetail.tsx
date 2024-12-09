"use client";

import { FeedItemRenderer } from "@/features/feed";
import { useFeedState } from "@/hooks/useFeedState";
import { PhotoAlbumModal } from "@/components/elements/PhotoAlbumModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActivityDetail } from "@/hooks/useActivityDetail";

interface ActivityDetailProps {
  activityId: string;
}

export function ActivityDetail({ activityId }: ActivityDetailProps) {
  const router = useRouter();
  const { data: activity, isLoading } = useActivityDetail(activityId);
  const { selectedActivityId, setSelectedActivityId } = useFeedState();

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4 -ml-2 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </Button>
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4 -ml-2 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">活動が見つかりませんでした</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={handleBack} className="mb-4 -ml-2 gap-2">
        <ArrowLeft className="w-4 h-4" />
        戻る
      </Button>
      <FeedItemRenderer
        item={activity}
        onPhotoClick={(activityId) => setSelectedActivityId(activityId)}
      />
      {selectedActivityId && (
        <PhotoAlbumModal
          isOpen={true}
          onClose={() => setSelectedActivityId(null)}
          photos={
            activity.user_contributions?.flatMap((contribution) =>
              contribution.user_photos.map((photo) => ({
                url: photo.url,
                user_id: photo.user_id,
              }))
            ) || []
          }
          users={Array.from(
            new Map(
              activity.user_contributions?.map((contribution) => [
                contribution.user_id,
                {
                  id: contribution.user_id,
                  name: contribution.users.name ?? "",
                  thumbnail_url: contribution.users.thumbnail_url || "",
                },
              ]) || []
            ).values()
          )}
          activityName={activity.title || ""}
          date={activity.created_at || null}
          location={activity.location || null}
          activityId={activity.id}
        />
      )}
    </div>
  );
}
