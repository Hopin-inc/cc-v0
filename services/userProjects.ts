import { createSupabaseClient } from "./base";

export const userProjectsService = {
  joinProject: async (projectId: string) => {
    const supabase = createSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("user_projects")
      .insert({
        user_id: user.id,
        project_id: projectId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        // 一意性制約違反（既に参加している）
        throw new Error("既にプロジェクトに参加しています");
      }
      throw error;
    }

    return data;
  },

  isJoined: async (projectId: string): Promise<boolean> => {
    const supabase = createSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from("user_projects")
      .select("*")
      .eq("user_id", user.id)
      .eq("project_id", projectId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // レコードが見つからない
        return false;
      }
      throw error;
    }

    return !!data;
  },
};
