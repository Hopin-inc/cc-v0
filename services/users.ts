import { UserProfile } from "@/types";
import { createSupabaseClient } from "./base";

export type UpdateUserProfileInput = {
  name?: string;
  bio?: string;
};

export const usersService = {
  getCurrentUser: async (): Promise<UserProfile> => {
    const supabase = createSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("users")
      .select(
        `
        *,
        badges (*)
      `
      )
      .eq("id", user.id)
      .single();

    if (error || !data) {
      throw new Error("Failed to fetch user profile");
    }

    return data;
  },

  getUser: async (userId: string): Promise<UserProfile> => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("users")
      .select("*, badges (*)")
      .eq("id", userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  updateProfile: async (userId: string, input: UpdateUserProfileInput) => {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("users")
      .update(input)
      .eq("id", userId);

    if (error) {
      throw new Error("Failed to update user profile");
    }
  },

  updateThumbnailUrl: async (userId: string, thumbnailUrl: string) => {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("users")
      .update({ thumbnail_url: thumbnailUrl })
      .eq("id", userId);

    if (error) {
      throw error;
    }
  },

  getUsers: async (): Promise<UserProfile[]> => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("users")
      .select(`
        *,
        badges (*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },
};
