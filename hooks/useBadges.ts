import { useCallback, useState } from "react";
import { badgesService } from "@/services/badges";

export const useBadges = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [badges, setBadges] = useState<
    Awaited<ReturnType<typeof badgesService.getBadges>>
  >([]);

  const fetchBadges = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await badgesService.getBadges();
      setBadges(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBadge = useCallback(
    async (badge: Parameters<typeof badgesService.createBadge>[0]) => {
      try {
        setIsLoading(true);
        await badgesService.createBadge(badge);
        await fetchBadges();
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchBadges]
  );

  const updateBadge = useCallback(
    async (
      id: string,
      badge: Parameters<typeof badgesService.updateBadge>[1]
    ) => {
      try {
        setIsLoading(true);
        await badgesService.updateBadge(id, badge);
        await fetchBadges();
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchBadges]
  );

  const deleteBadge = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        await badgesService.deleteBadge(id);
        await fetchBadges();
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchBadges]
  );

  const assignBadgeToUser = useCallback(
    async (userId: string, badgeId: string) => {
      try {
        setIsLoading(true);
        await badgesService.assignBadgeToUser(userId, badgeId);
        await fetchBadges();
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchBadges]
  );

  const removeBadgeFromUser = useCallback(
    async (userId: string, badgeId: string) => {
      try {
        setIsLoading(true);
        await badgesService.removeBadgeFromUser(userId, badgeId);
        await fetchBadges();
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchBadges]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    badges,
    isLoading,
    error,
    clearError,
    fetchBadges,
    createBadge,
    updateBadge,
    deleteBadge,
    assignBadgeToUser,
    removeBadgeFromUser,
  };
};
