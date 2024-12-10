import { useCallback, useState, useEffect } from "react";
import { FeedItem } from "@/types";
import { activitiesService } from "@/services/activities";
import { useCache } from "./useCache";

export const useFeedState = (projectId?: string) => {
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const { getCachedData, invalidateCache } = useCache<FeedItem[]>(
    projectId ? `feed-items-${projectId}` : "feed-items-all"
  );

  const loadFeedItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCachedData(() =>
        activitiesService.fetchFeedItems()
      );
      const filteredData = data.filter((item) => {
        // Filter by project if projectId is provided
        if (projectId && item.project_id !== projectId) {
          return false;
        }
        // Filter out empty contributions
        if (item.type === "contribution") {
          return item.user_contributions.length > 0;
        }
        return true;
      });
      setFeedItems(filteredData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadFeedItems();
  }, [loadFeedItems]);

  const onPhotoClick = (activityId: string) => {
    setSelectedActivityId(activityId);
  };

  return {
    selectedActivityId,
    setSelectedActivityId,
    onPhotoClick,
    feedItems,
    setFeedItems,
    isLoading,
    refetch: () => {
      invalidateCache();
      return loadFeedItems();
    },
  };
};
