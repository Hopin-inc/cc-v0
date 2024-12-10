import { FeedItem } from "@/types";
import { createSupabaseClient } from "./base";

const ACTIVITIES_SELECT_QUERY = `
  *,
  user_contributions (
    *,
    users (*),
    user_photos (*)
  ),
  created_by:users!created_by_user_id(*),
  comments:user_activity_comments (
    *,
    users:user_id (
      id,
      name,
      thumbnail_url
    )
  ),
  activity_badges (
    badge_id,
    badges!badge_id (
      id,
      name,
      value,
      created_at
    )
  )
` as const;

export const activitiesService = {
  fetchUserActivities: async (
    projectId: string,
    userId: string
  ): Promise<FeedItem[]> => {
    const supabase = createSupabaseClient();
    const [{ data: contributionActivities }, { data: commentActivities }] =
      await Promise.all([
        // 貢献活動の取得
        supabase
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
          .returns<FeedItem[]>(),
        // コメントを含む活動の取得
        supabase
          .from("activities")
          .select(`${ACTIVITIES_SELECT_QUERY}`)
          .match({
            project_id: projectId,
            "comments.user_id": userId,
            type: "recruitment",
          })
          .not("comments", "is", null)
          .order("created_at", { ascending: false })
          .returns<FeedItem[]>(),
      ]);

    if (!contributionActivities || !commentActivities) {
      throw new Error("Failed to fetch activities");
    }

    // 重複を除去して結合
    const mergedActivities = [...contributionActivities, ...commentActivities];
    const uniqueActivities = Array.from(
      new Map(mergedActivities.map((item) => [item.id, item])).values()
    );

    return uniqueActivities;
  },

  fetchFeedItems: async (): Promise<FeedItem[]> => {
    const supabase = createSupabaseClient();

    const { data: activities, error: activitiesError } = await supabase
      .from("activities")
      .select(`${ACTIVITIES_SELECT_QUERY}`)
      .order("date", { ascending: false });

    if (activitiesError) {
      throw new Error("Failed to fetch activities");
    }

    return (activities || []).filter((item) => {
      if (item.type === "contribution") {
        return item.user_contributions.length > 0;
      }
      return true;
    });
  },

  fetchActivityById: async (id: string): Promise<FeedItem> => {
    const supabase = createSupabaseClient();
    const { data: activity, error } = await supabase
      .from("activities")
      .select(`${ACTIVITIES_SELECT_QUERY}`)
      .eq("id", id)
      .single();

    if (error || !activity) {
      throw new Error("Failed to fetch activity");
    }

    return activity;
  },

  fetchFeedItemById: async (activityId: string): Promise<FeedItem> => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("activities")
      .select(`${ACTIVITIES_SELECT_QUERY}`)
      .eq("id", activityId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },
};
