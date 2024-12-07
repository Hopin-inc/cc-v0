import { useState, useEffect } from "react";
import { FeedItem } from "@/types";
import { activitiesService } from "@/services";
import { useCurrentProject } from "@/hooks/useCurrentProject";
import { useCurrentUserContext } from "@/contexts/UserContext";

export const useUserActivities = (userId?: string) => {
  const [activities, setActivities] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useCurrentUserContext();
  const { currentProject } = useCurrentProject();

  useEffect(() => {
    let isMounted = true;
    const loadActivities = async () => {
      if (!currentProject?.id) {
        setIsLoading(false);
        return;
      }

      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await activitiesService.fetchUserActivities(
          currentProject.id,
          userId
        );
        if (isMounted) {
          setActivities(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch activities")
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadActivities();

    return () => {
      isMounted = false;
    };
  }, [userId, currentUser?.id, currentProject?.id]);

  const filteredActivities = activities.filter(
    (activity) => activity && activity.type === "contribution"
  );

  return {
    activities: filteredActivities,
    isLoading,
    error,
  };
};
