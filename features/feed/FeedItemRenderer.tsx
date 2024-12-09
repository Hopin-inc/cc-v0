import { FeedItem } from "@/types";
import { FeedItem as FeedItemComponent } from "@/features/feed";

type FeedItemRendererProps = {
  item: FeedItem;
  onPhotoClick: (activityId: string) => void;
};

export function FeedItemRenderer({
  item,
  onPhotoClick,
}: FeedItemRendererProps) {
  return (
    <FeedItemComponent key={item.id} item={item} onPhotoClick={onPhotoClick} />
  );
}
