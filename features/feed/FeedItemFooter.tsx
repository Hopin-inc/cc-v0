"use client";

import { formatDate } from "@/utils/date";
import { cn } from "@/utils/cn";
import { Comment } from "@/types";
import { MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { Button } from "@/components/ui";

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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // ⌘ + Enter で送信
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      if (editingCommentId) {
        handleUpdate(e);
      } else {
        handleSubmit(e);
      }
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
              users={users.map((user) => ({
                name: user.name ?? "",
                thumbnailUrl: user.thumbnailUrl ?? "",
                id: user.id,
              }))}
              limit={3}
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
        <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-100">
          <CommentList
            comments={comments}
            onEdit={handleEdit}
            onDelete={handleDelete}
            editingCommentId={editingCommentId}
            editingContent={editingContent}
            onEditingContentChange={setEditingContent}
            onUpdate={handleUpdate}
            onCancelEdit={() => {
              setEditingCommentId(null);
              setEditingContent("");
            }}
            onKeyDown={handleKeyDown}
          />
          <CommentForm
            value={newComment}
            onChange={setNewComment}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
    </div>
  );
}
