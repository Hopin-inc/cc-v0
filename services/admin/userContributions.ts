import { ContributionStatus, UserContribution } from "@/types";
import { createSupabaseClient } from "../base";

export const adminUserContributionsService = {
  fetchAll: async (projectId: string): Promise<UserContribution[]> => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("user_contributions")
      .select(`*,users(*),user_photos(*)`)
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Failed to fetch user contributions");
    }

    return data as UserContribution[];
  },

  associateActivity: async (
    contributionId: string,
    activityId: string
  ): Promise<void> => {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("user_contributions")
      .update({ activity_id: activityId })
      .eq("id", contributionId);

    if (error) {
      throw new Error("Failed to update contribution activity");
    }
  },

  updateStatus: async (
    contributionId: string,
    status: ContributionStatus
  ): Promise<void> => {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("user_contributions")
      .update({ status: status as string })
      .eq("id", contributionId);

    if (error) {
      throw new Error("Failed to update contribution status");
    }
  },

  approveContribution: async (contributionId: string) => {
    const supabase = createSupabaseClient();

    // Start a Supabase transaction
    const { data: contribution, error: fetchError } = await supabase
      .from("user_contributions")
      .select(
        `
        *,
        contribution_types(*),
        users(
          id,
          available_points,
          total_points
        )
      `
      )
      .eq("id", contributionId)
      .single();

    if (fetchError)
      throw new Error("Failed to fetch contribution for approval");
    if (!contribution) throw new Error("Contribution not found");

    const points = contribution.contribution_types?.point ?? 0;
    const currentAvailablePoints = contribution.users?.available_points ?? 0;
    const currentTotalPoints = contribution.users?.total_points ?? 0;
    const userId = contribution.user_id;
    const projectId = contribution.project_id;

    // Update contribution status
    const { error: updateError } = await supabase
      .from("user_contributions")
      .update({ status: "approved" })
      .eq("id", contributionId);

    if (updateError) throw new Error("Failed to update contribution status");

    // Update user points
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({
        available_points: currentAvailablePoints + points,
        total_points: currentTotalPoints + points,
      })
      .eq("id", userId);

    if (userUpdateError) throw new Error("Failed to update user points");

    // Create point transaction record
    const { error: transactionError } = await supabase
      .from("user_point_transactions")
      .insert({
        user_id: userId,
        project_id: projectId,
        point: points,
        type: "earn",
      });

    if (transactionError) throw new Error("Failed to create point transaction");

    // await notificationsService.create({
    //   user_id: userId,
    //   type: "contribution_approved",
    //   message: `申請された活動が承認されました`, // #TODO: 活動名も含めるなど
    //   project_id: projectId,
    //   url: `/profile`, // #TODO: 活動ページみたいの用意したら、そっちに飛びたい
    // });

    return { success: true };
  },

  remove: async (contributionId: string): Promise<void> => {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("user_contributions")
      .delete()
      .eq("id", contributionId);

    if (error) {
      throw new Error("Failed to delete contribution");
    }
  },
};
