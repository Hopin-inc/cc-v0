import { useState, useEffect } from "react";
import { activitiesService } from "@/services/activities";
import type { FeedItem } from "@/types";
import { useCache } from "./useCache";

export function useFeedState() {
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  );

  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getCachedData } = useCache<FeedItem[]>("feed-items");

  const loadFeedItems = async () => {
    try {
      const data = await getCachedData(() =>
        activitiesService.fetchFeedItems()
      );
      setFeedItems(data);
    } catch (error) {
      console.error("Failed to load feed items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeedItems();
  }, []);

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
  };
}
