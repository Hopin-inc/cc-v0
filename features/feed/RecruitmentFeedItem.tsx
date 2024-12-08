"use client";

import { FeedItem, User } from "@/types";
import { FeedItemHeader } from "./FeedItemHeader";
import { FeedItemContent } from "./FeedItemContent";
import { FeedItemFooter } from "./FeedItemFooter";
import { useActivityComments } from "@/hooks/useActivityComments";
import { useCurrentUserContext } from "@/contexts/UserContext";
import { useState, useMemo } from "react";
import { UserContribution } from "@/types"; // Assuming UserContribution type is defined here

type RecruitmentFeedItemProps = {
  item: FeedItem;
};

export function RecruitmentFeedItem({ item }: RecruitmentFeedItemProps) {
  const {
    title,
    content,
    date,
    location,
    created_by,
    comments,
    user_contributions,
  } = item;

  const { currentUser } = useCurrentUserContext();

  const [localUserContributions, setLocalUserContributions] =
    useState<UserContribution[]>(user_contributions);

  const {
    comments: activityComments,
    addComment,
    isLoading,
    updateComment,
    deleteComment,
  } = useActivityComments(item.id, comments);

  const users = useMemo(
    () =>
      Array.from(
        new Map(
          [
            ...(created_by
              ? [
                  {
                    id: created_by.id,
                    name: created_by.name || "名前未設定",
                    thumbnailUrl: created_by.thumbnail_url || undefined,
                  },
                ]
              : []),
            ...localUserContributions.flatMap((contribution) => ({
              id: contribution.user_id,
              name: contribution.users.name || "名前未設定",
              thumbnailUrl: contribution.users.thumbnail_url || undefined,
            })),
          ].map((user) => [user.id, user])
        ).values()
      ),
    [created_by, localUserContributions]
  );

  const createOptimisticUserContribution = (user: User): UserContribution => ({
    id: "dummy",
    activity_id: item.id,
    user_id: user.id,
    project_id: item.project_id,
    type_id: "dummmy",
    date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    status: "approved",
    users: user,
    user_photos: [],
  });

  const handleAddComment = async (content: string) => {
    await addComment(content);
    // コメント追加後、楽観的にユーザーを追加
    if (currentUser) {
      setLocalUserContributions((prev) => [
        ...prev,
        createOptimisticUserContribution(currentUser),
      ]);
    }
  };

  return (
    <div>
      <FeedItemHeader type="recruitment" />
      <div className="space-y-2">
        <FeedItemContent title={title} content={content} type="recruitment" />
        <FeedItemFooter
          date={date}
          location={location}
          users={users}
          comments={activityComments}
          onAddComment={handleAddComment}
          onUpdateComment={updateComment}
          onDeleteComment={deleteComment}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
