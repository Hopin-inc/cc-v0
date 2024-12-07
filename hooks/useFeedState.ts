import { useState, useEffect } from "react";
import { activitiesService } from "@/services/activities";
import type { FeedItem } from "@/types";

export function useFeedState() {
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  );

  const [participationStatus, setParticipationStatus] = useState<{
    [key: string]: boolean;
  }>({});

  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFeedItems = async () => {
    try {
      const data = await activitiesService.fetchFeedItems();
      setFeedItems(data);
    } catch (error) {
      console.error("Failed to load feed items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (feedItems.length) return;
    loadFeedItems();
  }, []);

  const onPhotoClick = (activityId: string) => {
    setSelectedActivityId(activityId);
  };

  return {
    selectedActivityId,
    setSelectedActivityId,
    participationStatus,
    setParticipationStatus,
    onPhotoClick,
    feedItems,
    setFeedItems,
    isLoading,
  };
}
