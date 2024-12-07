import { TablesInsert } from "@/types/supabase";
import { createSupabaseClient } from "./base";

export const userPhotoService = {
  save: async (input: TablesInsert<"user_photos">): Promise<string> => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("user_photos")
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error("Database save error:", error);
      if (error.code === "42501") {
        throw new Error("アクセス権限がありません。管理者に確認してください。");
      }
      throw new Error(error.message || "写真の保存に失敗しました");
    }

    return data.id;
  },
};
