import { TablesInsert } from "@/types/supabase";
import { createSupabaseClient } from "./base";
import { Notification } from "@/types";

export const notificationsService = {
  async create(args: TablesInsert<"notifications">): Promise<Notification> {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("notifications")
      .insert([
        {
          user_id: args.user_id,
          type: args.type,
          message: args.message,
          url: args.url,
          project_Id: args.project_id,
          is_read: false,
        },
      ])
      .select(
        `
        *
      `
      )
      .single();

    if (error) throw error;
    return data;
  },

  async getNotifications(userId: string): Promise<Notification[]> {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("notifications")
      .select(
        `
        *
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async markAsRead(notificationId: string): Promise<void> {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) throw error;
  },
};
