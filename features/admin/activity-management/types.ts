export type Activity = {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
};

export type ActivityFormState = {
  title: string;
  content: string;
};

export const initialActivityFormState: ActivityFormState = {
  title: "",
  content: "",
};

export const createActivityFormFromActivity = (
  activity: Activity
): ActivityFormState => ({
  title: activity.title,
  content: activity.content || "",
});
