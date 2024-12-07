import { ContributionType } from "@/types";
import { createSupabaseClient } from "./base";

export const contributionTypesService = {
  fetchAll: async (): Promise<ContributionType[]> => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from("contribution_types").select();

    if (error) {
      throw new Error("Failed to fetch contribution types");
    }

    return data;
  },
};
