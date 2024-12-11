"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useFeedState } from "@/hooks/useFeedState";
import { generateTimelineFromFeed } from "@/utils/mapTimeline";
import Link from "next/link";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { formatDate } from "@/utils/date";
import { formatContent } from "@/utils/formatContent";
import { ArrowUpRight, MapPin, Clock } from "lucide-react";
import { FeedItem } from "@/types";

type Props = {
  feedItems: FeedItem[];
};

export function ProjectTimeline({ feedItems }: Props) {
  const timelineEvents = generateTimelineFromFeed(feedItems);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-muted-foreground/80">
          活動年表
        </CardTitle>
      </CardHeader>
      <CardContent>
        {timelineEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="relative mb-8">
              <div className="bg-muted/30 p-4 rounded-full">
                <Clock className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <div className="absolute -left-[6px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-gray-300 border-2 border-background"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              まだ活動記録がありません
            </h3>
            <p className="text-sm text-muted-foreground/60 max-w-sm">
              プロジェクトの活動を登録すると、時系列で表示されます。
              <br />
              最初の活動を記録して、プロジェクトの歴史を始めましょう！
            </p>
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="w-[280px] h-[2px] bg-border relative">
                <div className="absolute -left-[6px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-gray-300 border-2 border-background"></div>
                <div className="absolute -right-[6px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-gray-300 border-2 border-background"></div>
              </div>
              <p className="text-sm text-muted-foreground/60 italic">
                ここに活動の歴史が刻まれていきます
              </p>
            </div>
          </div>
        ) : (
          <div className="relative pl-0 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {timelineEvents.map((event, index) => (
              <div key={index} className="mb-8 relative">
                <div className="absolute -left-[6px] top-0 w-3.5 h-3.5 rounded-full bg-gray-300 border-2 border-background"></div>
                <div className="pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      {formatDate(event.date)}
                    </span>
                    {event.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/activities/${event.id}`}
                    className="group block p-4 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {event.icon && (
                        <span className="text-lg" role="img" aria-label="icon">
                          {event.icon}
                        </span>
                      )}
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                        {event.title}
                      </h3>
                      <ArrowUpRight className="opacity-0 group-hover:opacity-100 w-4 h-4 text-primary transition-opacity" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                      {formatContent(event.description)}
                    </p>
                    {event.images.length > 0 && (
                      <ScrollArea className="w-full whitespace-nowrap rounded-md border mt-4">
                        <div className="flex w-max space-x-4 p-4">
                          {event.images.map((image, imageIndex) => (
                            <div
                              key={imageIndex}
                              className="overflow-hidden rounded-md shrink-0 w-[120px] h-[150px]"
                            >
                              <Image
                                src={image}
                                alt={`Image ${imageIndex + 1}`}
                                className="object-cover w-full h-full"
                                width={120}
                                height={150}
                              />
                            </div>
                          ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    )}
                    {event.participants.length > 0 && (
                      <AvatarGroup
                        users={event.participants.map((p) => ({
                          id: p.userId,
                          name: p.name,
                          thumbnailUrl: p.thumbnailUrl,
                        }))}
                        limit={6}
                        className="mt-4"
                      />
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
