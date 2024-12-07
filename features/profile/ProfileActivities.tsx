import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PhotoAlbumModal } from "@/components/elements/PhotoAlbumModal";
import { Maximize2, Search } from "lucide-react";
import { useUserActivities } from "@/hooks/useUserActivities";
import { formatDate } from "@/utils/date";
import { Button } from "@/components/ui/button";

type ProfileActivitiesProps = {
  userId?: string;
};

export function ProfileActivities({ userId }: ProfileActivitiesProps) {
  const { activities, isLoading } = useUserActivities(userId);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  );

  const filteredActivities = activities.filter(
    (activity) =>
      activity &&
      activity.type === "contribution" &&
      activity.user_contributions.length > 0
  );

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">関わった活動</h3>
        {filteredActivities.length > 0 && (
          <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
            {filteredActivities.length}回
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="py-8 text-center space-y-4">
          <div className="text-muted-foreground text-sm">
            関わった活動はまだありません
          </div>
          <Link href="/" className="inline-block">
            <Button variant="outline" size="sm" className="gap-2">
              <Search className="w-4 h-4" />
              活動を探す
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredActivities.map((activity) => {
            const photos = activity.user_contributions.flatMap((contribution) =>
              contribution.user_photos.map((photo) => ({
                url: photo.url,
                user_id: contribution.user_id,
              }))
            );
            const users = Array.from(
              new Map(
                activity.user_contributions.map((contribution) => [
                  contribution.user_id,
                  {
                    name: contribution.users.name,
                    thumbnail_url: contribution.users.thumbnail_url || "",
                  },
                ])
              ).values()
            );

            return (
              <div key={activity.id} className="space-y-2">
                <div
                  className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
                  onClick={() => setSelectedActivityId(activity.id)}
                >
                  {photos[0] && (
                    <Image
                      src={photos[0].url}
                      alt={activity.content || ""}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                  )}
                  <div className="absolute bottom-2 left-2 flex -space-x-2">
                    {users.slice(0, 3).map((user, index) => (
                      <Avatar
                        key={index}
                        className="w-6 h-6 border-2 border-white"
                      >
                        <AvatarImage
                          src={user.thumbnail_url || ""}
                          alt={user.name || ""}
                        />
                        <AvatarFallback>{user.name}</AvatarFallback>
                      </Avatar>
                    ))}
                    {users.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center border-2 border-background z-10">
                        <span className="text-[10px] text-muted-foreground">
                          +{users.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                    <Maximize2
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      size={24}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium line-clamp-2">
                    {activity.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(activity.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {selectedActivityId &&
        (() => {
          const selectedActivity = activities.find(
            (activity) => activity.id === selectedActivityId
          );
          if (!selectedActivity) return null;

          const photos = selectedActivity.user_contributions.flatMap(
            (contribution) =>
              contribution.user_photos.map((photo) => ({
                url: photo.url,
                user_id: contribution.user_id,
              }))
          );

          const users = Array.from(
            new Map(
              selectedActivity.user_contributions.map((contribution) => [
                contribution.user_id,
                {
                  name: contribution.users.name || "",
                  thumbnail_url: contribution.users.thumbnail_url || "",
                },
              ])
            ).values()
          );

          return (
            <PhotoAlbumModal
              isOpen={!!selectedActivityId}
              onClose={() => setSelectedActivityId(null)}
              photos={photos}
              users={users}
              activityName={selectedActivity.content || ""}
              location={selectedActivity.location || ""}
              date={formatDate(selectedActivity.created_at)}
            />
          );
        })()}
    </div>
  );
}
