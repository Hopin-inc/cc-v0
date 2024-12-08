import { FeedItem } from "@/types";
import { FeedItemHeader } from "./FeedItemHeader";
import { FeedItemContent } from "./FeedItemContent";
import { FeedItemFooter } from "./FeedItemFooter";

type AnnouncementFeedItemProps = {
  item: FeedItem;
};

export function AnnouncementFeedItem({ item }: AnnouncementFeedItemProps) {
  const { title, content, date, location, created_by } = item;

  return (
    <div>
      <FeedItemHeader type="announcement" />
      <FeedItemContent title={title} content={content} />
      <FeedItemFooter
        date={date}
        location={location}
        users={
          created_by
            ? [
                {
                  id: created_by.id,
                  name: created_by.name || "名前未設定",
                  thumbnailUrl: created_by.thumbnail_url || undefined,
                },
              ]
            : []
        }
      />
    </div>
  );
}
