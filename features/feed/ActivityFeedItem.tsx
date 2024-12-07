import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FeedItem } from "@/types";
import { Maximize2 } from "lucide-react";
import { formatDate } from "@/utils/date";
import Link from "next/link";

type ActivityFeedItemProps = {
  item: FeedItem;
  onPhotoClick: (activityId: string) => void;
  layout?: "grid" | "default";
};

export function ActivityFeedItem({
  item,
  onPhotoClick,
  layout = "default",
}: ActivityFeedItemProps) {
  const { user_contributions, title, content, date, location } = item;
  const photos = user_contributions.flatMap(
    (contribution) => contribution.user_photos
  );
  const users = Array.from(
    new Map(
      user_contributions
        .flatMap((contribution) => contribution.users)
        .map((user) => [user.id, user])
    ).values()
  );

  return (
    <div className="space-y-2">
      {photos && photos.length > 0 && (
        <div
          className={`grid ${
            layout === "grid" ? "grid-cols-2" : "grid-cols-4"
          }`}
        >
          {photos.slice(0, 4).map((photo, index) => (
            <div
              key={index}
              className={`relative ${
                layout === "grid" ? "aspect-[4/3]" : "aspect-square"
              } group cursor-pointer overflow-hidden
  ${index === 0 ? "rounded-tl-md" : ""}
  ${index === 1 ? "rounded-tr-md" : ""}
  ${index === 2 ? "rounded-bl-md" : ""}
  ${index === 3 ? "rounded-br-md" : ""}`}
              onClick={() => onPhotoClick(item.id)}
            >
              <Image
                src={photo.url}
                alt={`活動の写真 ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className=""
              />
              <div
                className={`absolute inset-0 overflow-hidden
  ${index === 0 ? "rounded-tl-md" : ""}
  ${index === 1 ? "rounded-tr-md" : ""}
  ${index === 2 ? "rounded-bl-md" : ""}
  ${index === 3 ? "rounded-br-md" : ""}`}
              >
                {index === 3 && photos.length > 4 ? (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center group-hover:bg-opacity-30 transition-opacity duration-300">
                    <span className="text-white text-sm font-bold group-hover:opacity-0 transition-opacity duration-300">
                      +{photos.length - 4}
                    </span>
                    <Maximize2
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute"
                      size={24}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                    <Maximize2
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      size={24}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <h3 className="font-semibold text-base">{title}</h3>
      <p className="text-sm text-muted-foreground">{content}</p>
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>
          {date && formatDate(date)}・{location}
        </div>
        <div className="flex -space-x-2">
          {users?.slice(0, 3).map((user, index) => (
            <Link href={`/user/${user.id}`} key={index}>
              <Avatar className="w-8 h-8 border-2 border-background hover:opacity-80 transition-opacity">
                <AvatarImage
                  src={user.thumbnail_url || ""}
                  alt={user.name || ""}
                />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
            </Link>
          ))}
          {users && users.length > 3 && (
            <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium border-2 border-background relative z-10">
              +{users.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
