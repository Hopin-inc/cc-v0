import { FeedItem } from "@/types";
import { FeedItemHeader } from "./FeedItemHeader";
import { FeedItemContent } from "./FeedItemContent";
import { FeedItemFooter } from "./FeedItemFooter";

type RecruitmentFeedItemProps = {
  item: FeedItem;
};

export function RecruitmentFeedItem({ item }: RecruitmentFeedItemProps) {
  const { title, content, date, location, created_by } = item;

  return (
    <div>
      <FeedItemHeader type="recruitment" />
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
