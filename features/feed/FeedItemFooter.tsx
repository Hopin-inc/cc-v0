import { AvatarGroup } from "@/components/ui/avatar-group";
import { formatDate } from "@/utils/date";
import { cn } from "@/utils/cn";
import { Comment } from "@/types";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FeedItemFooterProps = {
  date?: string | null;
  location?: string | null;
  users: Array<{
    id: string;
    name: string;
    thumbnailUrl?: string;
  }>;
  className?: string;
  comments: Comment[];
  onAddComment: (comment: string) => void;
  isLoading?: boolean;
};

export function FeedItemFooter({
  date,
  location,
  users,
  className,
  comments,
  onAddComment,
}: FeedItemFooterProps) {
  const [newComment, setNewComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div>
            {date && formatDate(date)}
            {location && `・${location}`}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
              isExpanded && "text-foreground"
            )}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length}</span>
          </button>
        </div>
        <AvatarGroup users={users} />
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4 pl-4 border-l">
          <div className="space-y-2">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={comment.users.thumbnail_url || undefined}
                    alt={comment.users.name || "名前未設定"}
                  />
                  <AvatarFallback>
                    {(comment.users.name || "名前未設定").slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {comment.users.name || "名前未設定"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="コメントを追加..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm" variant="secondary">
              送信
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
