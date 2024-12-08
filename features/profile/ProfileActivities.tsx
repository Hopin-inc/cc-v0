import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PhotoAlbumModal } from "@/components/elements/PhotoAlbumModal";
import { Maximize2, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserActivities } from "@/hooks/useUserActivities";
import { useFeedState } from "@/hooks/useFeedState";
import { formatDate } from "@/utils/date";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RecruitmentFeedItem } from "@/features/feed/RecruitmentFeedItem";

type ProfileActivitiesProps = {
  userId?: string;
};

export function ProfileActivities({ userId }: ProfileActivitiesProps) {
  const { activities, isLoading } = useUserActivities(userId);
  const { feedItems } = useFeedState();
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  );

  const contributionActivities = activities.filter(
    (activity) =>
      activity &&
      activity.type === "contribution" &&
      activity.user_contributions.length > 0
  );

  const discussionActivities = feedItems.filter(
    (activity) =>
      activity &&
      activity.type === "recruitment" &&
      activity.comments &&
      activity.comments.some((comment) => comment.user_id === userId)
  );

  const enrichedActivities = contributionActivities.map((activity) => {
    const feedItem = feedItems.find((item) => item.id === activity.id);
    return {
      ...activity,
      user_contributions: feedItem
        ? feedItem.user_contributions
        : activity.user_contributions,
    };
  });

  const selectedActivity = activities.find(
    (activity) => activity.id === selectedActivityId
  );

  return (
    <div className="space-y-6 mt-6">
      <Tabs defaultValue="contributions">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="contributions"
            className="flex items-center gap-2"
          >
            <span>関わった活動</span>
            {contributionActivities.length > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-medium text-primary">
                {contributionActivities.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <span>参加した議論</span>
            {discussionActivities.length > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-medium text-primary">
                {discussionActivities.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contributions" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square bg-muted animate-pulse rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : enrichedActivities.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">関わった活動はまだありません</h3>
                <p className="text-sm text-muted-foreground">
                  活動に参加して、あなたの経験を共有しましょう
                </p>
              </div>
              <Link href="/" className="inline-block">
                <Button variant="outline" size="sm" className="gap-2">
                  <Search className="w-4 h-4" />
                  活動を探す
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {enrichedActivities.map((activity) => {
                const photos = activities
                  .find((a) => a.id === activity.id)
                  ?.user_contributions.flatMap((contribution) =>
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
                      {photos?.[0] && (
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
                      <p className="text-base font-bold line-clamp-2">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(activity.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="discussions" className="mt-6">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="space-y-4 p-4 border rounded-lg animate-pulse"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : discussionActivities.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">参加した議論はまだありません</h3>
                <p className="text-sm text-muted-foreground">
                  活動にコメントして、他のメンバーと交流しましょう
                </p>
              </div>
              <Link href="/" className="inline-block">
                <Button variant="outline" size="sm" className="gap-2">
                  <Search className="w-4 h-4" />
                  活動を探す
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {discussionActivities.map((activity) => (
                <RecruitmentFeedItem key={activity.id} item={activity} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedActivity && (
        <PhotoAlbumModal
          isOpen={!!selectedActivityId}
          onClose={() => setSelectedActivityId(null)}
          photos={
            enrichedActivities
              .find((activity) => activity.id === selectedActivityId)
              ?.user_contributions.flatMap((contribution) =>
                contribution.user_photos.map((photo) => ({
                  url: photo.url,
                  user_id: contribution.user_id,
                }))
              ) || []
          }
          users={Array.from(
            new Map(
              enrichedActivities
                .find((activity) => activity.id === selectedActivityId)
                ?.user_contributions.map((contribution) => [
                  contribution.user_id,
                  {
                    id: contribution.user_id,
                    name: contribution.users.name ?? "",
                    thumbnail_url: contribution.users.thumbnail_url || "",
                  },
                ]) || []
            ).values()
          )}
          activityName={selectedActivity?.title || ""}
          date={selectedActivity?.created_at || null}
          location={selectedActivity?.location || null}
          activityId={selectedActivity.id}
        />
      )}
    </div>
  );
}
