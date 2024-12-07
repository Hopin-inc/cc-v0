import { FeedItem } from "@/types";
import { FeedItem as FeedItemComponent } from "@/features/feed";

type FeedItemRendererProps = {
  item: FeedItem;
  onPhotoClick: (activityId: string) => void;
  participationStatus?: boolean;
  onParticipationRequest?: () => void;
  setParticipationStatus: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
};

export function FeedItemRenderer({
  item,
  onPhotoClick,
  participationStatus,
  setParticipationStatus,
}: FeedItemRendererProps) {
  const handleParticipationRequest = () => {
    setParticipationStatus((prev) => ({
      ...prev,
      [item.id]: !prev[item.id],
    }));
  };

  return (
    <FeedItemComponent
      key={item.id}
      item={item}
      onPhotoClick={onPhotoClick}
      participationStatus={participationStatus}
      onParticipationRequest={handleParticipationRequest}
    />
  );
}
