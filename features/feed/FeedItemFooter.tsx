import { AvatarGroup } from "@/components/ui/avatar-group";
import { formatDate } from "@/utils/date";
import { cn } from "@/utils/cn";
import { Comment } from "@/types";
import { MessageCircle, MapPin } from "lucide-react";
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
          <time>{date && formatDate(date)}</time>
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {users.length > 0 && (
            <AvatarGroup
              users={users}
              limit={3}
              className="hover:scale-105 transition-transform"
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full transition-all duration-200",
              "hover:bg-gray-100 hover:scale-110",
              "active:scale-95",
              isExpanded && "text-primary bg-primary/10"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5" />
              {comments.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-[10px] text-white rounded-full min-w-[16px] h-4 flex items-center justify-center">
                  {comments.length}
                </span>
              )}
            </div>
          </Button>
        </div>
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
