import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Badge as BadgeType } from "@/types";

type FeedItemHeaderProps = {
  type: "activity" | "recruitment" | "announcement";
  badges?: BadgeType[];
  className?: string;
};

const typeLabels = {
  activity: "活動",
  recruitment: "ゆる募",
  announcement: "お知らせ",
} as const;

export function FeedItemHeader({
  type,
  badges,
  className,
}: FeedItemHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-2 mb-4", className)}>
      <div className="flex items-start gap-2">
        <Badge variant="weak-secondary">{typeLabels[type]}</Badge>
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <Badge
                key={badge.id}
                variant="weak-outline"
                className="text-xs px-2 py-0.5"
              >
                # {badge.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
