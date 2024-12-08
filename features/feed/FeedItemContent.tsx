import { cn } from "@/utils/cn";
import { formatContent } from "@/utils/formatContent";

type FeedItemContentProps = {
  title: string;
  content?: string | null;
  className?: string;
};

export function FeedItemContent({
  title,
  content,
  className,
}: FeedItemContentProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="font-semibold text-base">{title}</h3>
      {content && (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {formatContent(content)}
        </p>
      )}
    </div>
  );
}
