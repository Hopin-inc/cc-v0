"use client";

import { PhotoAlbumModal } from "@/components/elements";
import { FeedItemRenderer } from "@/features/feed";
import { useFeedState } from "@/hooks/useFeedState";
import { FeedSkeleton } from "./FeedSkeleton";
import { useProjects } from "@/hooks/useProjects";

type Props = {
  projectSlug?: string;
};
export function IntegratedFeed({ projectSlug }: Props) {
  const { data: projects } = useProjects();

  const projectId = projectSlug
    ? projects?.find((project) => project.slug === projectSlug)?.id
    : undefined;

  const {
    onPhotoClick,
    selectedActivityId,
    setSelectedActivityId,
    feedItems,
    isLoading,
  } = useFeedState(projectId);

  const selectedActivity = selectedActivityId
    ? feedItems.find((item) => item.id === selectedActivityId)
    : null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-muted-foreground mb-4">
        最近の動向
      </h2>
      {isLoading ? (
        <FeedSkeleton />
      ) : (
        <>
          {feedItems.map((item) => (
            <FeedItemRenderer
              key={item.id}
              item={item}
              onPhotoClick={onPhotoClick}
              showProject={!projectSlug}
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
