import { createSupabaseClient } from "./base";
import { Comment } from "@/types";

export const commentsService = {
  fetchActivityComments: async (activityId: string) => {
    const supabase = createSupabaseClient();
    const { data: comments, error } = await supabase
      .from("user_activity_comment")
      .select(
        `
        *,
        users:user_id (
          id,
          name,
          thumbnail_url
        )
      `
      )
      .eq("activity_id", activityId)
      .order("created_at", { ascending: true })
      .returns<Comment[]>();

    if (error) {
      throw new Error("Failed to fetch comments");
    }

    return comments;
  },

  addComment: async (activityId: string, userId: string, content: string) => {
    const supabase = createSupabaseClient();
    const { data: comment, error } = await supabase
      .from("user_activity_comment")
      .insert([
        {
          activity_id: activityId,
          user_id: userId,
          content,
        },
      ])
      .select(
        `
        *,
        users:user_id (
          id,
          name,
          thumbnail_url
        )
      `
      )
      .returns<Comment>()
      .single();

    if (error) {
      throw new Error("Failed to add comment");
    }

    return comment;
  },

  updateComment: async (commentId: string, content: string) => {
    const supabase = createSupabaseClient();
    const { data: comment, error } = await supabase
      .from("user_activity_comment")
      .update({ content })
      .eq("id", commentId)
      .select(
        `
        *,
        users:user_id (
          id,
          name,
          thumbnail_url
        )
      `
      )
      .returns<Comment>()
      .single();

    if (error) {
      throw new Error("Failed to update comment");
    }

    return comment;
  },

  deleteComment: async (commentId: string) => {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("user_activity_comment")
      .delete()
      .eq("id", commentId);

    if (error) {
      throw new Error("Failed to delete comment");
    }
  },
};
