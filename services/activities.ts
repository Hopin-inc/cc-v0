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
      .match({
        project_id: projectId,
        type: "contribution",
        "user_contributions.user_id": userId,
        "user_contributions.status": "approved",
      })
      .not("user_contributions", "is", null)
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
      .match({
        type: "contribution",
        "user_contributions.status": "approved",
      })
      .not("user_contributions", "is", null)
      .order("date", { ascending: false })
      .returns<FeedItem[]>();

    if (error) {
      throw new Error("Failed to fetch feed items");
    }

    return activities;
  },
};
