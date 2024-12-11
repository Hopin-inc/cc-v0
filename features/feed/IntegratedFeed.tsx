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
import { Calendar, Users } from "lucide-react";

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

  const renderEmptyState = () => {
    // データやプロジェクトのロード中、もしくは初期状態の場合は何も表示しない
    if (isLoading || isProjectLoading || feedItems === undefined || projects === undefined) return null;
    
    // データの取得が完了し、かつデータが空の場合のみ表示
    if (feedItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-lg border">
          <div className="bg-muted/30 p-4 rounded-full mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground/60" />
          </div>
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            {currentProject ? "まだ活動記録がありません" : "活動記録がありません"}
          </h3>
          <p className="text-sm text-muted-foreground/60 max-w-sm">
            {currentProject ? (
              <>
                このプロジェクトにはまだ活動記録がありません。
                <br />
                活動を申請して、プロジェクトの歴史を刻んでいきましょう！
              </>
            ) : (
              <>
                プロジェクトを選択すると、そのプロジェクトの活動記録が表示されます。
                <br />
                または、すべてのプロジェクトの活動を見ることもできます。
              </>
            )}
          </p>
        </div>
      );
    }
    
    return null;
  };

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
        </div>
        {isLoading ? (
          <FeedSkeleton />
        ) : (
          <>
            {renderEmptyState()}
            {feedItems && feedItems.length > 0 && (
              <>
                {feedItems.map((item) => (
                  <FeedItemRenderer
                    key={item.id}
                    item={item}
                    onPhotoClick={onPhotoClick}
                    showProject={!currentProject}
                  />
                ))}
              </>
            )}
          </>
        )}
        {currentProject && <ActivitySubmissionForm />}
      </div>
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
  );
}
