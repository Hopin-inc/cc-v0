import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Comment } from "@/types";
import { MessageCircle } from "lucide-react";
import { cn } from "@/utils/cn";

type CommentSectionProps = {
  comments: Comment[];
  onAddComment: (comment: string) => void;
  isLoading?: boolean;
};

export function CommentSection({
  comments,
  onAddComment,
  isLoading,
}: CommentSectionProps) {
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
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "absolute right-0 top-0 flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-muted-foreground transition-colors rounded-md hover:bg-secondary/80",
          isExpanded && "bg-secondary"
        )}
      >
        <MessageCircle className="w-4 h-4" />
        <span>{comments.length}</span>
      </button>

      {isExpanded && (
        <div className="mt-10 space-y-4">
          <div className="space-y-3">
            {comments.map(
              (comment) =>
                comment.users && (
                  <div
                    key={comment.id}
                    className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
                  >
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarImage
                        src={comment.users.thumbnail_url || ""}
                        alt={comment.users.name ?? ""}
                      />
                      <AvatarFallback>
                        {comment.users.name?.[0] ?? ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm">
                        {comment.users.name}
                      </p>
                      <p className="text-sm text-muted-foreground break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                )
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="コメントを追加..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm">
              送信
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
