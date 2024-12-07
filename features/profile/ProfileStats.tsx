import { Card } from "@/components/ui/card";
import { Award, LucideIcon, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Badge as BadgeType, UserProfile } from "@/types";
import { useCurrentUserContext } from "@/contexts/UserContext";

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
  const { currentUser } = useCurrentUserContext();

  if (isLoading || !userProfile) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const convertToUIStats = (): ProfileStatUI[] => {
    return [
      {
        type: "badges",
        title: "バッジ",
        items: currentUser?.badges || [],
        icon: Award,
      },
      {
        type: "points",
        title: "ポイント",
        items: [{ label: "総獲得", value: currentUser?.total_points || 0 }],
        icon: Star,
        value: currentUser?.available_points || 0,
        unit: "pt",
      },
    ];
  };

  const stats = convertToUIStats();

  return (
    <div className="grid gap-4 grid-cols-2">
      {stats.map((stat, index) => (
        <Card key={index} className="p-3">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-1.5 bg-primary/10 rounded-full">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              {stat.title}
            </p>
          </div>
          <div className="pl-9">
            {stat.type === "badges" && (
              <div className="flex flex-wrap gap-1">
                {stat.items.length > 0 ? (
                  stat.items.map((item, itemIndex) => (
                    <Badge
                      key={itemIndex}
                      variant="secondary"
                      className="text-[10px] py-0.5"
                    >
                      {item.name}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="text-[10px] py-0.5">
                    未取得
                  </Badge>
                )}
              </div>
            )}
            {stat.type === "points" && (
              <div>
                <div className="text-base font-bold text-foreground">
                  {stat.value.toLocaleString()}
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    {stat.unit}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  総獲得: {stat.value.toLocaleString()}
                  {stat.unit}
                </p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
