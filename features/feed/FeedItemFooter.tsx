import { AvatarGroup } from "@/components/ui/avatar-group";
import { formatDate } from "@/utils/date";
import { cn } from "@/utils/cn";

type FeedItemFooterProps = {
  date?: string | null;
  location?: string | null;
  users: Array<{
    id: string;
    name: string;
    thumbnailUrl?: string;
  }>;
  className?: string;
};

export function FeedItemFooter({
  date,
  location,
  users,
  className,
}: FeedItemFooterProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-center text-sm text-muted-foreground",
        className
      )}
    >
      <div>
        {date && formatDate(date)}
        {location && `・${location}`}
      </div>
      <AvatarGroup users={users} />
    </div>
  );
}
