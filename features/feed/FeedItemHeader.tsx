import { cn } from "@/utils/cn";

type FeedItemHeaderProps = {
  type: "activity" | "recruitment" | "announcement";
  className?: string;
};

const typeLabels = {
  activity: "活動",
  recruitment: "ゆる募",
  announcement: "お知らせ",
} as const;

export function FeedItemHeader({ type, className }: FeedItemHeaderProps) {
  return (
    <div className={cn("flex items-start gap-2 mb-4", className)}>
      <div className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-medium">
        {typeLabels[type]}
      </div>
    </div>
  );
}
