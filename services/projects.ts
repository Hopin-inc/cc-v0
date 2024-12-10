import { createSupabaseClient } from "./base";
import { ProjectType } from "@/types";

type UserProjectsProject = {
  project: ProjectType;
};

export const projectsService = {
  getCurrentProject: async (): Promise<ProjectType | null> => {
    const supabase = createSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // ユーザーに紐づいているプロジェクトのうち、最も古いものを取得
    const { data, error } = await supabase
      .from("user_projects")
      .select(
        `
        project:projects (
          *
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .returns<UserProjectsProject[]>()
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // レコードが見つからない場合
        return null;
      }
      throw error;
    }

    return data?.project || null;
  },

  /**
   * プロジェクト一覧を取得する
   * @returns Promise<ProjectType[]> - プロジェクト一覧
   */
  getProjects: async (): Promise<ProjectType[]> => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * プロジェクトを検索する
   * @param query - 検索クエリ
   * @returns Promise<ProjectType[]> - 検索結果のプロジェクト一覧
   */
  searchProjects: async (query: string): Promise<ProjectType[]> => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .ilike("name", `%${query}%`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * プロジェクトをIDで取得する
   * @param id - プロジェクトID
   * @returns Promise<ProjectType> - プロジェクト
   */
  getProjectById: async (id: string): Promise<ProjectType> => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
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
