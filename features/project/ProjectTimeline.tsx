"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { timelineEvents } from "@/data";

export function ProjectTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">活動年表</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-0 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {timelineEvents.map((event, index) => (
            <div key={index} className="mb-8 relative">
              <div className="absolute -left-[6px] top-0 w-3.5 h-3.5 rounded-full bg-gray-300 border-2 border-background"></div>
              <div className="pl-4">
                <span className="text-xs font-medium text-muted-foreground mb-1 block">
                  {event.date}
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  {event.title}
                </h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  {event.description}
                </p>
                <div className="flex items-center relative mb-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center relative">
                          <div className="flex -space-x-3">
                            {event.participants
                              .slice(0, 3)
                              .map((participant, participantIndex) => (
                                <Avatar
                                  key={participantIndex}
                                  className="w-8 h-8 border-2 border-background"
                                >
                                  <AvatarImage
                                    src={participant.avatar}
                                    alt={participant.name}
                                  />
                                  <AvatarFallback>
                                    {participant.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                          </div>
                          {event.participants.length > 3 && (
                            <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium border-2 border-background -ml-3 relative z-10">
                              +{event.participants.length - 3}
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          参加者:{" "}
                          {event.participants.map((p) => p.name).join("、")}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                  <div className="flex w-max space-x-4 p-4">
                    {event.images.map((image, imageIndex) => (
                      <div
                        key={imageIndex}
                        className="relative w-[250px] h-[150px] flex-shrink-0"
                      >
                        <Image
                          src={image}
                          alt={`${event.title} - 写真 ${imageIndex + 1}`}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
