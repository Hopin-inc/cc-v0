"use client";

import { useState, useCallback } from "react";
import { useCurrentProjectContext } from "@/contexts/ProjectContext";
import { ProjectPrizeItem } from "@/types";
import { TablesInsert, TablesUpdate } from "@/types/supabase";
import { projectPrizeItemsService } from "@/services/projectPrizeItems";

export function useProjectPrizeItems() {
  const { currentProject } = useCurrentProjectContext();
  const [prizeItems, setPrizeItems] = useState<ProjectPrizeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = () => setError(null);

  const fetchPrizeItems = useCallback(async () => {
    if (!currentProject?.id) {
      setPrizeItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await projectPrizeItemsService.fetchPrizeItems(
        currentProject.id
      );
      setPrizeItems(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch prize items")
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentProject?.id]);

  const createPrizeItem = async (
    prizeItem: TablesInsert<"project_prize_items">
  ) => {
    setError(null);
    try {
      await projectPrizeItemsService.createPrizeItem(prizeItem);
      await fetchPrizeItems();
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to create prize item")
      );
      throw err;
    }
  };

  const updatePrizeItem = async (
    id: number,
    updates: Partial<TablesUpdate<"project_prize_items">>
  ) => {
    setError(null);
    try {
      await projectPrizeItemsService.updatePrizeItem(id, updates);
      await fetchPrizeItems();
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update prize item")
      );
      throw err;
    }
  };

  const deletePrizeItem = async (id: string) => {
    setError(null);
    try {
      await projectPrizeItemsService.deletePrizeItem(id);
      await fetchPrizeItems();
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete prize item")
      );
      throw err;
    }
  };

  return {
    prizeItems,
    isLoading,
    error,
    clearError,
    fetchPrizeItems,
    createPrizeItem,
    updatePrizeItem,
    deletePrizeItem,
  };
}
