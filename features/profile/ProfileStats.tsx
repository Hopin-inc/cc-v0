"use client";

import { Card } from "@/components/ui/card";
import { Award, LucideIcon, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Badge as BadgeType, UserProfile } from "@/types";
import CountUp from "react-countup";

interface StatItem {
  label: string;
  value: number;
}

interface BadgesStat {
  type: "badges";
  title: string;
  items: BadgeType[];
  icon: LucideIcon;
}

interface PointsStat {
  type: "points";
  title: string;
  items: StatItem[];
  icon: LucideIcon;
  value: number;
  unit: string;
}

type ProfileStatUI = BadgesStat | PointsStat;

interface ProfileStatsProps {
  userProfile: UserProfile | null;
  isLoading: boolean;
}

export function ProfileStats({ userProfile, isLoading }: ProfileStatsProps) {
  if (isLoading || !userProfile) {
    return (
      <div className="grid gap-4 grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card
            key={i}
            className="p-3"
          >
            <div className="flex items-center space-x-2 mb-3">
              <div className="h-7 w-7 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            </div>
            <div className="pl-9">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="h-4 w-12 bg-muted rounded animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const convertToUIStats = (): ProfileStatUI[] => {
    return [
      {
        type: "badges",
        title: "バッジ",
        items: userProfile?.badges || [],
        icon: Award,
      },
      {
        type: "points",
        title: "ポイント",
        items: [{ label: "総獲得", value: userProfile?.total_points || 0 }],
        icon: Star,
        value: userProfile?.available_points || 0,
        unit: "pt",
      },
    ];
  };

  const stats = convertToUIStats();

  return (
    <div className="grid gap-4 grid-cols-2">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="p-3"
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 bg-primary/5 rounded-full">
              <stat.icon className="h-4 w-4 text-primary/80" />
            </div>
            <p className="text-xs font-medium text-muted-foreground/80">
              {stat.title}
            </p>
          </div>
          <div className="pl-9">
            {stat.type === "badges" && (
              <div className="flex flex-wrap gap-2">
                {stat.items.length > 0 ? (
                  stat.items.map((item, itemIndex) => (
                    <Badge
                      key={itemIndex}
                      variant="weak-secondary"
                      className="text-[10px] py-0.5"
                    >
                      # {item.name}
                    </Badge>
                  ))
                ) : (
                  <Badge
                    variant="weak-secondary"
                    className="text-[10px] py-0.5"
                  >
                    未取得
                  </Badge>
                )}
              </div>
            )}
            {stat.type === "points" && (
              <div>
                <div className="text-base font-bold text-foreground flex items-baseline">
                  <CountUp
                    end={stat.value}
                    duration={2}
                    separator=","
                    suffix={stat.unit}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-baseline gap-x-1"
                    >
                      <span>{item.label}</span>
                      <CountUp
                        end={item.value}
                        duration={2}
                        separator=","
                        suffix={stat.unit}
                        enableScrollSpy
                        scrollSpyOnce
                        className="font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
