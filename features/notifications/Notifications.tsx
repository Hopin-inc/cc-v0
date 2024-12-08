"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Link from "next/link";
import { formatDate } from "@/utils/date";

export function Notifications() {
  const { currentUser } = useCurrentUser();
  const { notifications, isLoading, fetchNotifications, markAsRead } =
    useNotifications(currentUser?.id || "");

  useEffect(() => {
    if (currentUser?.id) {
      fetchNotifications();
    }
  }, [currentUser]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  if (!currentUser) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {isLoading ? (
          <DropdownMenuItem>読み込み中...</DropdownMenuItem>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onClick={() => handleMarkAsRead(String(notification.id))}
              asChild
            >
              <Link href={notification.url || "#"}>
                <div className="flex flex-col gap-1">
                  <span
                    className={
                      notification.is_read ? "text-gray-500" : "text-gray-700 font-medium"
                    }
                  >
                    {notification.message}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(notification.created_at)}
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem>通知はありません</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
