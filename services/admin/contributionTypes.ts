import { ContributionType } from "@/types";
import { createSupabaseClient } from "../base";

type CreateContributionTypeInput = {
  name: string;
  value: string;
  point?: number;
};

type UpdateContributionTypeInput = {
  name?: string;
  value?: string;
  point?: number;
};

export const adminContributionTypesService = {
  fetchAll: async (): Promise<ContributionType[]> => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("contribution_types")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Failed to fetch contribution types");
    }

    return data as ContributionType[];
  },

  create: async (input: CreateContributionTypeInput): Promise<void> => {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("contribution_types").insert([input]);

    if (error) {
      throw new Error("Failed to create contribution type");
    }
  },

  update: async (
    id: string,
    input: UpdateContributionTypeInput
  ): Promise<void> => {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("contribution_types")
      .update(input)
      .eq("id", id);

    if (error) {
      throw new Error("Failed to update contribution type");
    }
  },

  delete: async (id: string): Promise<void> => {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("contribution_types")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error("Failed to delete contribution type");
    }
  },
};
