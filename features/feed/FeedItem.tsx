import { Card, CardContent } from "@/components/ui";
import { ActivityFeedItem } from "@/features/feed";
import { AnnouncementFeedItem } from "@/features/feed";
import { RecruitmentFeedItem } from "@/features/feed";
import { FeedItem as FeedItemType } from "@/types";
import { Button } from "@/components/ui";
import { UserPlus, UserMinus } from "lucide-react";

type FeedItemProps = {
  item: FeedItemType;
  onPhotoClick: (activityId: string) => void;
  participationStatus?: boolean;
  onParticipationRequest?: () => void;
  children?: React.ReactNode;
};

export function FeedItem({
  item,
  onPhotoClick,
  participationStatus,
  onParticipationRequest,
  children,
}: FeedItemProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
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
