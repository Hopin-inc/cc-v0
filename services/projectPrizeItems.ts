import { createSupabaseClient } from "@/services/base";
import { TablesInsert, TablesUpdate } from "@/types/supabase";

export const projectPrizeItemsService = {
  fetchPrizeItems: async (projectId: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("project_prize_items")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  createPrizeItem: async (prizeItem: TablesInsert<"project_prize_items">) => {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("project_prize_items")
      .insert([prizeItem]);

    if (error) throw error;
  },

  updatePrizeItem: async (
    id: number,
    updates: Partial<TablesUpdate<"project_prize_items">>
  ) => {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("project_prize_items")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
  },

  deletePrizeItem: async (id: string) => {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("project_prize_items")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
