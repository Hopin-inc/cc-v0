import { createSupabaseClient } from "./base";
import { Comment } from "@/types";
import { userContributionsService } from "./userContributions";
import { TablesInsert } from "@/types/supabase";

export const commentsService = {
  fetchActivityComments: async (activityId: string) => {
    const supabase = createSupabaseClient();
    const { data: comments, error } = await supabase
      .from("user_activity_comments")
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

  addComment: async (args: TablesInsert<"user_activity_comments">) => {
    const supabase = createSupabaseClient();

    // 1. まずactivityの情報を取得して、typeを確認
    const { data: activity, error: activityError } = await supabase
      .from("activities")
      .select("type, project_id")
      .eq("id", args.activity_id)
      .single();

    // 2. コメントを追加
    const { data: comment, error: commentError } = await supabase
      .from("user_activity_comments")
      .insert([args])
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
      .order("created_at", { ascending: true })
      .single();

    if (commentError || !comment) {
      throw new Error("Failed to add comment");
    }

    // 3. ゆる募の場合、申請データを作成
    if (activity?.type === "recruitment") {
      const existingContribution =
        await userContributionsService.findExistingContribution(
          args.activity_id,
          args.user_id
        );

      if (!existingContribution) {
        // 申請データを作成（自動承認）
        await userContributionsService.create({
          activity_id: args.activity_id,
          user_id: args.user_id,
          status: "approved",
          type_id: "57ee3bc7-76af-4b4d-8606-c648fc8ff860", // #NOTE: ひとまずフリーに
          project_id: args.project_id,
        });
      }
    }

    return comment;
  },

  updateComment: async (commentId: string, content: string) => {
    const supabase = createSupabaseClient();
    const { data: comment, error } = await supabase
      .from("user_activity_comments")
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
      .from("user_activity_comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      throw new Error("Failed to delete comment");
    }
  },
};
