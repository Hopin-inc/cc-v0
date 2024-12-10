import { FeedItem } from "@/types";
import { FeedItem as FeedItemComponent } from "@/features/feed";

type FeedItemRendererProps = {
  item: FeedItem;
  onPhotoClick: (activityId: string) => void;
  showProject?: boolean;
};

export function FeedItemRenderer({
  item,
  onPhotoClick,
  showProject = false,
}: FeedItemRendererProps) {
  return (
    <FeedItemComponent
      key={item.id}
      item={item}
      onPhotoClick={onPhotoClick}
      showProject={showProject}
    />
  );
}
