import { createSupabaseClient } from "./base";
import { ProjectType } from "@/types";

export const projectsService = {
  getCurrentProject: async (): Promise<ProjectType> => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("project")
      .select("*")
      .order("created_at", { ascending: true })
      // 便宜的に最新のプロジェクトを現在のプロジェクトとして取得
      .limit(1)
      .single();

    if (error || !data) {
      throw new Error("Failed to fetch user profile");
    }

    // Set the current project ID in a cookie for middleware
    document.cookie = `current-project-id=${data.id}; path=/`;

    return data;
  },

  /**
   * プロジェクトの総配布ポイントを取得する
   * @param projectId - プロジェクトID
   * @returns Promise<number> - 総配布ポイント数
   */
  getTotalDistributionPoints: async (projectId: string): Promise<number> => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("user_point_transactions")
      .select("point")
      .match({ project_id: projectId, type: "earn" });

    if (error) {
      throw error;
    }

    return data.reduce((sum, transaction) => sum + (transaction.point || 0), 0);
  },
};
