"use client";

import { FeedItem } from "@/types";
import { FeedItemHeader } from "./FeedItemHeader";
import { FeedItemContent } from "./FeedItemContent";
import { FeedItemFooter } from "./FeedItemFooter";
import { useActivityComments } from "@/hooks/useActivityComments";

type RecruitmentFeedItemProps = {
  item: FeedItem;
};

export function RecruitmentFeedItem({ item }: RecruitmentFeedItemProps) {
  const { title, content, date, location, created_by, comments } = item;
  const {
    comments: activityComments,
    addComment,
    isLoading,
    updateComment,
    deleteComment,
  } = useActivityComments(item.id, comments);

  return (
    <div>
      <FeedItemHeader type="recruitment" />
      <div className="space-y-2">
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
          comments={activityComments}
          onAddComment={addComment}
          onUpdateComment={updateComment}
          onDeleteComment={deleteComment}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
