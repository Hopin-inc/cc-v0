import { useState, useEffect } from "react";
import { commentsService } from "@/services/comments";
import { useCurrentUserContext } from "@/contexts/UserContext";
import { toast } from "sonner";
import { Comment } from "@/types";

export function useActivityComments(activityId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useCurrentUserContext();

  const loadComments = async () => {
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
    if (!currentUser?.id) {
      toast.error("コメントを追加するにはログインが必要です");
      return;
    }

    try {
      const newComment = await commentsService.addComment(
        activityId,
        currentUser.id,
        content
      );
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
    comments,
    addComment,
    updateComment,
    deleteComment,
    isLoading,
  };
}
