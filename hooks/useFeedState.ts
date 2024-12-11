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
  const {
    getCachedData: getCachedProjectActivities,
    invalidateCache: invalidateProjectCache,
  } = useCache<FeedItem[]>(
    projectId ? `feed-items-${projectId}` : "project-activities"
  );
  const {
    getCachedData: getCachedFeedItems,
    invalidateCache: invalidateFeedCache,
  } = useCache<FeedItem[]>("feed-items");

  const loadFeedItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await (projectId
        ? getCachedProjectActivities(() =>
            activitiesService.fetchProjectActivities(projectId)
          )
        : getCachedFeedItems(() => activitiesService.fetchFeedItems()));
      setFeedItems(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadFeedItems();
  }, [projectId]);

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
      if (projectId) {
        invalidateProjectCache();
      } else {
        invalidateFeedCache();
      }
      return loadFeedItems();
    },
  };
};
