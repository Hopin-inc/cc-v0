import React, { useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PhotoAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Array<{
    url: string;
    user_id: string;
  }>;
  users: Array<{
    name: string;
    thumbnail_url: string;
  }>;
  activityName: string;
  date: string | null;
  location: string | null;
}

export function PhotoAlbumModal({
  isOpen,
  onClose,
  photos,
  users,
  activityName,
  date,
  location,
}: PhotoAlbumModalProps) {
  useEffect(() => {
    if (isOpen) {
      window.scrollTo(0, 0);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto p-0 rounded-xl overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 items-start">
          <DialogTitle className="text-xl font-semibold">
            {activityName}
          </DialogTitle>
          <div className="text-sm text-gray-500">
            <span>{date}</span> • <span>{location}</span>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="px-6 space-y-8 pb-8">
            {(photos ?? []).map((photo, index) => {
              const user = users?.find((u) => u.thumbnail_url === photo.url);
              return (
                <div key={index} className="relative">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={photo.url}
                      alt={`${activityName} - 写真 ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                    {user && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 rounded-b-lg">
                        <div className="flex items-center">
                          <Avatar className="w-8 h-8 border-2 border-white/80 shadow-md">
                            <AvatarImage
                              src={user.thumbnail_url}
                              alt={user.name}
                            />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="ml-2 text-sm font-medium text-white drop-shadow-md">
                            {user.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
