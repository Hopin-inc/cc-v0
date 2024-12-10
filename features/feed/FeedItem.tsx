import { Card, CardContent } from "@/components/ui";
import { ActivityFeedItem } from "@/features/feed";
import { AnnouncementFeedItem } from "@/features/feed";
import { RecruitmentFeedItem } from "@/features/feed";
import { FeedItem as FeedItemType } from "@/types";
import Link from "next/link";
import { useProjects } from "@/hooks/useProjects";

type FeedItemProps = {
  item: FeedItemType;
  onPhotoClick: (activityId: string) => void;
  showProject?: boolean;
  children?: React.ReactNode;
};

export function FeedItem({
  item,
  onPhotoClick,
  showProject = false,
  children,
}: FeedItemProps) {
  const { data: projects } = useProjects();
  const project = projects.find((p) => p.id === item.project_id);

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {showProject && project && (
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-300 to-gray-200 flex-shrink-0" />
            <Link
              href={`/p/${project.slug}`}
              className="text-sm font-medium text-muted-foreground hover:text-primary hover:underline"
            >
              {project.name}
            </Link>
          </div>
        )}
        {item.type === "contribution" && (
          <ActivityFeedItem
            item={item}
            onPhotoClick={onPhotoClick}
            layout="grid"
          />
        )}
        {item.type === "announcement" && <AnnouncementFeedItem item={item} />}
        {item.type === "recruitment" && <RecruitmentFeedItem item={item} />}
        {children}
      </CardContent>
    </Card>
  );
}
