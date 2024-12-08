import { FeedItem } from "@/types";
import { Maximize2 } from "lucide-react";
import { FeedItemHeader } from "./FeedItemHeader";
import { FeedItemContent } from "./FeedItemContent";
import { FeedItemFooter } from "./FeedItemFooter";
import Image from "next/image";
import { useActivityComments } from "@/hooks/useActivityComments";

type ActivityFeedItemProps = {
  item: FeedItem;
  onPhotoClick: (id: string) => void;
  layout?: "default" | "grid";
};

export function ActivityFeedItem({
  item,
  onPhotoClick,
  layout = "default",
}: ActivityFeedItemProps) {
  const { user_contributions, title, content, date, location, comments } = item;
  const {
    comments: activityComments,
    addComment,
    isLoading,
    updateComment,
    deleteComment,
  } = useActivityComments(item.id, comments);
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
    <div>
      <FeedItemHeader type="activity" />
      <div className="w-full mb-4">
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
          <FeedItemContent title={title} content={content} />
          <FeedItemFooter
            date={date}
            location={location}
            users={users.map((user) => ({
              id: user.id,
              name: user.name || "名前未設定",
              thumbnailUrl: user.thumbnail_url || undefined,
            }))}
            comments={activityComments}
            onUpdateComment={updateComment}
            onDeleteComment={deleteComment}
            onAddComment={addComment}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
