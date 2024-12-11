"use client";

import { PhotoAlbumModal } from "@/components/elements";
import { FeedItemRenderer } from "@/features/feed";
import { useFeedState } from "@/hooks/useFeedState";
import { FeedSkeleton } from "./FeedSkeleton";
import { useProjects } from "@/hooks/useProjects";
import { useCurrentProjectContext } from "@/contexts/ProjectContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectOverviewCard } from "../project";
import { ActivitySubmissionForm } from "../activity";

export function IntegratedFeed() {
  const {
    currentProject,
    isLoading: isProjectLoading,
    setCurrentProject,
  } = useCurrentProjectContext();
  const { data: projects } = useProjects();
  const {
    onPhotoClick,
    selectedActivityId,
    setSelectedActivityId,
    feedItems,
    isLoading,
  } = useFeedState(currentProject?.id);

  const selectedActivity = selectedActivityId
    ? feedItems.find((item) => item.id === selectedActivityId)
    : null;

  return (
    <>
      {currentProject && (
        <ProjectOverviewCard
          projectSlug={currentProject?.slug}
          feedItems={feedItems}
        />
      )}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          {isProjectLoading ? (
            <>
              <div className="h-7 w-48 bg-muted animate-pulse rounded" />
              <div className="h-10 w-[180px] bg-muted animate-pulse rounded" />
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-muted-foreground">
                最近の動向
              </h2>
              <Select
                value={currentProject?.id || "all"}
                onValueChange={(value) => {
                  if (value === "all") {
                    setCurrentProject(null);
                  } else {
                    const selected = projects?.find((p) => p.id === value);
                    if (selected) {
                      setCurrentProject(selected);
                    }
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="プロジェクトを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
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
                showProject={!currentProject}
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
        {currentProject && <ActivitySubmissionForm />}
      </div>
    </>
  );
}
