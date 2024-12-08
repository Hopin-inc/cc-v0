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
  comments:user_activity_comment (
    *,
    users:user_id (
      id,
      name,
      thumbnail_url
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
          .eq("project_id", projectId)
          .eq("comments.user_id", userId)
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

    // 承認済みの活動を取得
    const { data: activities, error: activitiesError } = await supabase
      .from("activities")
      .select(`${ACTIVITIES_SELECT_QUERY}`)
      .match({
        type: "contribution",
        "user_contributions.status": "approved",
      })
      .not("user_contributions", "is", null)
      .order("date", { ascending: false });

    if (activitiesError) {
      throw new Error("Failed to fetch activities");
    }

    // ゆる募を取得
    const { data: recruitments, error: recruitmentsError } = await supabase
      .from("activities")
      .select(`${ACTIVITIES_SELECT_QUERY}`)
      .eq("type", "recruitment")
      .order("date", { ascending: false });

    if (recruitmentsError) {
      throw new Error("Failed to fetch recruitments");
    }

    // 活動とゆる募を日付でソート
    const allItems = [...(activities ?? []), ...(recruitments ?? [])].sort(
      (a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(a.created_at);
        const dateB = b.date ? new Date(b.date) : new Date(b.created_at);
        return dateB.getTime() - dateA.getTime();
      }
    );

    return allItems;
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
