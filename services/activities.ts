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
};
