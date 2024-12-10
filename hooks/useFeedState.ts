import { useCallback, useState, useEffect } from "react";
import { FeedItem } from "@/types";
import { activitiesService } from "@/services/activities";
import { useCache } from "./useCache";
import { useCurrentProjectContext } from "@/contexts/ProjectContext";

export const useFeedState = () => {
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const { currentProject } = useCurrentProjectContext();
  const { getCachedData, invalidateCache } = useCache<FeedItem[]>(
    `feed-items-${currentProject?.slug}`
  );

  const loadFeedItems = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!currentProject?.id) return;
      const data = await getCachedData(
        () => activitiesService.fetchFeedItems(currentProject.id),
        true
      );
      setFeedItems(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [currentProject?.id]);

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
