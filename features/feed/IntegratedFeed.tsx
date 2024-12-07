"use client";

import { PhotoAlbumModal } from "@/components/elements";
import { FeedItemRenderer } from "@/features/feed";
import { useFeedState } from "@/hooks/useFeedState";

export function IntegratedFeed() {
  const {
    selectedActivityId,
    setSelectedActivityId,
    participationStatus,
    setParticipationStatus,
    onPhotoClick,
    feedItems,
    isLoading,
  } = useFeedState();

  const selectedActivity = selectedActivityId
    ? feedItems.find((item) => item.id === selectedActivityId)
    : null;

  if (isLoading) {
    return <div className="text-center py-4">Loading feed...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">最近の動向</h2>
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
              thumbnail_url: contribution.users.thumbnail_url || "",
            })) || []
          }
          activityName={selectedActivity.title || ""}
          date={selectedActivity.date}
          location={selectedActivity.location}
          onClose={() => setSelectedActivityId(null)}
        />
      )}
    </div>
  );
}
