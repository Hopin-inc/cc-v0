import { createSupabaseClient } from "./base";
import { ProjectType } from "@/types";

export const projectsService = {
  getCurrentProject: async (): Promise<ProjectType | null> => {
    const supabase = createSupabaseClient();
    try {
      const { data, error } = await supabase
        .from("project")
        .select("*")
        .order("created_at", { ascending: true })
        // 便宜的に最新のプロジェクトを現在のプロジェクトとして取得
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching current project:", error);
      return null;
    }
  },
};
