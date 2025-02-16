import { ActivityType } from "@/types";

export type ActivityFormState = {
  title: string;
  content: string;
  date: string;
  location: string;
  badges: string[];
};

export const initialActivityFormState: ActivityFormState = {
  title: "",
  content: "",
  date: new Date().toISOString().split("T")[0], // YYYY-MM-DD形式で今日の日付を設定
  location: "",
  badges: [],
};

export const createActivityFormFromActivity = (
  activity: ActivityType
): ActivityFormState => ({
  title: activity.title || "",
  content: activity.content || "",
  date: activity.date
    ? activity.date.split("T")[0]
    : new Date().toISOString().split("T")[0],
  location: activity.location || "",
  badges: activity.badges?.map((badge) => badge.id) || [],
});
