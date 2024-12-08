import { Activity } from "@/types";
import { TablesInsert, TablesUpdate } from "@/types/supabase";
import { createSupabaseClient } from "../base";

export const adminActivitiesService = {
  fetchAll: async (projectId: string, type?: string): Promise<Activity[]> => {
    const supabase = createSupabaseClient();
    const query = supabase
      .from("activities")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (type) {
      query.eq("type", type);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error("Failed to fetch activities");
    }

    return data as Activity[];
  },

  create: async (input: TablesInsert<"activities">): Promise<void> => {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("activities").insert(input);

    if (error) {
      throw new Error("Failed to create activity");
    }
  },

  update: async (
    id: string,
    input: Partial<TablesUpdate<"activities">>
  ): Promise<void> => {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("activities")
      .update(input)
      .eq("id", id);

    if (error) {
      throw new Error("Failed to update activity");
    }
  },

  delete: async (id: string): Promise<void> => {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("activities").delete().eq("id", id);

    if (error) {
      throw new Error("Failed to delete activity");
    }
  },
};
