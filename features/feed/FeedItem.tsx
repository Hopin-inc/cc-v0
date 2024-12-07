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
          <>
            <div className="flex items-start gap-2 mb-4">
              <div className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm font-medium">
                活動
              </div>
            </div>
            <div className="w-full mb-4">
              <ActivityFeedItem
                item={item}
                onPhotoClick={onPhotoClick}
                layout="grid"
              />
            </div>
          </>
        )}
        {item.type === "announcement" && <AnnouncementFeedItem item={item} />}
        {item.type === "recruitment" && <RecruitmentFeedItem item={item} />}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-4">
            {item.type === "recruitment" ? (
              <Button
                variant={participationStatus ? "outline" : "default"}
                size="sm"
                onClick={onParticipationRequest}
                className="text-xs"
              >
                {participationStatus ? (
                  <>
                    <UserMinus className="w-3 h-3 mr-1" />
                    参加をキャンセル
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3 mr-1" />
                    参加をリクエスト
                  </>
                )}
              </Button>
            ) : // <Button
            //   variant="ghost"
            //   size="sm"
            //   onClick={onToggleComments}
            //   className="text-muted-foreground p-0 hover:bg-transparent"
            // >
            //   {commentsVisible
            //     ? "コメントを隠す"
            //     : `コメントを表示 (${commentsCount}件)`}
            // </Button>
            null}
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
