import { ActivityType } from "@/types";

export type ActivityFormState = {
  title: string;
  content: string;
  date: string;
  location: string;
  type: string;
};

export const initialActivityFormState: ActivityFormState = {
  title: "",
  content: "",
  date: "",
  location: "",
  type: "",
};

export const createActivityFormFromActivity = (
  activity: ActivityType
): ActivityFormState => ({
  title: activity.title,
  content: activity.content || "",
  date: activity.date || "",
  location: activity.location || "",
  type: activity.type || "",
});
