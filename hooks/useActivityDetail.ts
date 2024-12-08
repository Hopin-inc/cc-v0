"use client";

import { activitiesService } from "@/services/activities";
import { FeedItem } from "@/types";
import { useCallback, useEffect, useState } from "react";

export function useActivityDetail(activityId: string) {
  const [data, setData] = useState<FeedItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchActivity = useCallback(async () => {
    if (!activityId) return;
    
    setIsLoading(true);
    try {
      const activity = await activitiesService.fetchFeedItemById(activityId);
      setData(activity);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch activity"));
    } finally {
      setIsLoading(false);
    }
  }, [activityId]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchActivity,
  };
}
