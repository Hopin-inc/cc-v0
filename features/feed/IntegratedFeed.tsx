"use client";

import { PhotoAlbumModal } from "@/components/elements";
import { FeedItemRenderer } from "@/features/feed";
import { useFeedState } from "@/hooks/useFeedState";
import { FeedSkeleton } from "./FeedSkeleton";
import { useProjects } from "@/hooks/useProjects";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCurrentProjectContext } from "@/contexts/ProjectContext";

type Props = {
  projectSlug?: string;
};

export function IntegratedFeed({ projectSlug }: Props) {
  const { data: projects } = useProjects();
  const { currentProject } = useCurrentProjectContext();

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-muted-foreground">
          {projectSlug ? currentProject?.name : "最近"}の動向
        </h2>
        {projectSlug && (
          <Link
            href="/feed"
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 group"
          >
            全プロジェクトの動向
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )}
      </div>
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
