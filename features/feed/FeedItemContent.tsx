import { cn } from "@/utils/cn";
import { formatContent } from "@/utils/formatContent";

type FeedItemContentProps = {
  title: string;
  content?: string | null;
  className?: string;
  type?: "contribution" | "recruitment" | "announcement";
};

export function FeedItemContent({
  title,
  type = "contribution",
  content,
  className,
}: FeedItemContentProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="font-semibold text-base">{title}</h3>
      {content && (
        <p
          className={cn("text-sm whitespace-pre-wrap", {
            "text-muted-foreground": type === "contribution",
            "text-foreground": type !== "contribution",
          })}
        >
          {formatContent(content)}
        </p>
      )}
    </div>
  );
}
