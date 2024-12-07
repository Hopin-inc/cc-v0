import { useState } from "react";
import { notificationsService } from "@/services/notifications";
import { Notification } from "@/types";
import { toast } from "sonner";

export const useNotifications = (userId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await notificationsService.getNotifications(userId);
      setNotifications(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "通知の取得に失敗しました";
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          String(n.id) === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "通知の既読処理に失敗しました";
      toast.error(errorMessage);
    }
  };

  return {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
  };
};
