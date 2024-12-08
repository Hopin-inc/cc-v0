import { formatDate } from "@/utils/date";
import { cn } from "@/utils/cn";
import { Comment } from "@/types";
import {
  MessageCircle,
  MapPin,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarGroup } from "@/components/ui/avatar-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUserContext } from "@/contexts/UserContext";

type FeedItemFooterProps = {
  isLoading?: boolean;
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
  onUpdateComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
};

export function FeedItemFooter({
  date,
  location,
  users,
  className,
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}: FeedItemFooterProps) {
  const [newComment, setNewComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const { currentUser } = useCurrentUserContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment("");
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCommentId && editingContent.trim()) {
      onUpdateComment(editingCommentId, editingContent.trim());
      setEditingCommentId(null);
      setEditingContent("");
    }
  };

  const handleDelete = (commentId: string) => {
    if (window.confirm("このコメントを削除してもよろしいですか？")) {
      onDeleteComment(commentId);
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
        <div className="mt-4 space-y-4">
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
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {comment.users.name || "名前未設定"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    {currentUser?.id === comment.user_id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(comment)}
                            className="gap-2"
                          >
                            <Pencil className="h-4 w-4" />
                            <span>編集</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(comment.id)}
                            className="gap-2 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>削除</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  {editingCommentId === comment?.id ? (
                    <form onSubmit={handleUpdate} className="mt-2">
                      <div className="flex gap-2">
                        <Input
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          placeholder="コメントを編集"
                          className="flex-1"
                        />
                        <Button
                          type="submit"
                          size="sm"
                          variant="secondary"
                          onClick={() => setEditingCommentId(null)}
                        >
                          キャンセル
                        </Button>
                        <Button type="submit" size="sm">
                          更新
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="コメントを追加"
              className="flex-1"
            />
            <Button type="submit">送信</Button>
          </form>
        </div>
      )}
    </div>
  );
}
