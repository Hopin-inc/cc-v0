"use client";

import { PhotoAlbumModal } from "@/components/elements";
import { FeedItemRenderer } from "@/features/feed";
import { useFeedState } from "@/hooks/useFeedState";
import { FeedSkeleton } from "./FeedSkeleton";

export function IntegratedFeed() {
  const {
    onPhotoClick,
    selectedActivityId,
    setSelectedActivityId,
    participationStatus,
    setParticipationStatus,
    feedItems,
    isLoading,
  } = useFeedState();

  const selectedActivity = selectedActivityId
    ? feedItems.find((item) => item.id === selectedActivityId)
    : null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">最近の動向</h2>
      {isLoading ? (
        <FeedSkeleton />
      ) : (
        <>
          {feedItems.map((item) => (
            <FeedItemRenderer
              key={item.id}
              item={item}
              participationStatus={participationStatus[item.id] || false}
              onPhotoClick={onPhotoClick}
              setParticipationStatus={setParticipationStatus}
            />
          ))}
          {selectedActivity && (
            <PhotoAlbumModal
              isOpen={true}
              photos={
                selectedActivity.user_contributions?.flatMap((contribution) =>
                  contribution.user_photos.map((photo) => ({
                    url: photo.url,
                    user_id: photo.user_id,
                  }))
                ) || []
              }
              users={
                selectedActivity.user_contributions?.map((contribution) => ({
                  name: contribution.users.name || "",
                  id: contribution.users.id || "",
                  thumbnail_url: contribution.users.thumbnail_url || "",
                })) || []
              }
              activityName={selectedActivity.title || ""}
              date={selectedActivity.date}
              location={selectedActivity.location}
              onClose={() => setSelectedActivityId(null)}
              activityId={selectedActivity.id}
            />
          )}
        </>
      )}
    </div>
  );
}
