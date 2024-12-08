"use client";

import { useState, useEffect, useMemo } from "react";
import { commentsService } from "@/services/comments";
import { useCurrentUserContext } from "@/contexts/UserContext";
import { toast } from "sonner";
import { Comment } from "@/types";
import { useCurrentProjectContext } from "@/contexts/ProjectContext";

const sortCommentsByDate = (comments: Comment[]) =>
  comments.sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

export function useActivityComments(
  activityId: string,
  initialComments?: Comment[]
) {
  const [comments, setComments] = useState<Comment[]>(
    initialComments ? sortCommentsByDate(initialComments) : []
  );
  const [isLoading, setIsLoading] = useState(!initialComments);
  const { currentUser } = useCurrentUserContext();
  const { currentProject } = useCurrentProjectContext();

  const sortedComments = useMemo(
    () => sortCommentsByDate(comments),
    [comments]
  );

  const loadComments = async () => {
    if (initialComments) return;

    try {
      const data = await commentsService.fetchActivityComments(activityId);
      setComments(data);
    } catch (error) {
      console.error("Failed to load comments:", error);
      toast.error("コメントの読み込みに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!currentUser?.id || !currentProject?.id) {
      toast.error("コメントを追加するにはログインが必要です");
      return;
    }

    try {
      const newComment = await commentsService.addComment({
        activity_id: activityId,
        user_id: currentUser.id,
        content,
        project_id: currentProject.id,
      });
      setComments((prev) => [...prev, newComment]);
      toast.success("コメントを追加しました");
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("コメントの追加に失敗しました");
    }
  };

  const updateComment = async (commentId: string, content: string) => {
    try {
      const updatedComment = await commentsService.updateComment(
        commentId,
        content
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? updatedComment : comment
        )
      );
      toast.success("コメントを更新しました");
    } catch (error) {
      console.error("Failed to update comment:", error);
      toast.error("コメントの更新に失敗しました");
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await commentsService.deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      toast.success("コメントを削除しました");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("コメントの削除に失敗しました");
    }
  };

  useEffect(() => {
    loadComments();
  }, [activityId]);

  return {
    comments: sortedComments,
    addComment,
    updateComment,
    deleteComment,
    isLoading,
  };
}
