import { UserContribution } from "@/types";
import { createSupabaseClient } from "./base";
import { TablesInsert } from "@/types/supabase";

const USER_CONTRIBUTIONS_SELECT_QUERY = `
  *,
  users (*),
  user_photos (*)
` as const;

export const userContributionsService = {
  create: async (
    contribution: TablesInsert<"user_contributions">
  ): Promise<UserContribution> => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("user_contributions")
      .insert(contribution)
      .select(USER_CONTRIBUTIONS_SELECT_QUERY)
      .single();

    if (error || !data) {
      throw new Error("Failed to create user contribution");
    }

    return {
      ...data,
      users: data.users,
      user_photos: data.user_photos || [],
    };
  },
};
