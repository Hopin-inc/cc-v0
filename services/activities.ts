import { FeedItem } from "@/types";
import { createSupabaseClient } from "./base";

const ACTIVITIES_SELECT_QUERY = `
  *,
  user_contributions (
    *,
    users (*),
    user_photos (*)
  )
` as const;

export const activitiesService = {
  fetchUserActivities: async (
    projectId: string,
    userId: string
  ): Promise<FeedItem[]> => {
    const supabase = createSupabaseClient();
    const { data: activities, error } = await supabase
      .from("activities")
      .select(`${ACTIVITIES_SELECT_QUERY}`)
      .eq("project_id", projectId)
      .eq("user_contributions.user_id", userId)
      .eq("type", "contribution")
      .order("created_at", { ascending: false })
      .returns<FeedItem[]>();

    if (error) {
      throw new Error("Failed to fetch activities");
    }

    return activities;
  },

  fetchFeedItems: async (): Promise<FeedItem[]> => {
    const supabase = createSupabaseClient();
    const { data: activities, error } = await supabase
      .from("activities")
      .select(`${ACTIVITIES_SELECT_QUERY}`)
      .eq("type", "contribution")
      .order("created_at", { ascending: false })
      .returns<FeedItem[]>();

    if (error) {
      throw new Error("Failed to fetch feed items");
    }

    return activities;
  },
};
