"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUserContext } from "@/contexts/UserContext";
import { Comment } from "@/types";
import { formatContent } from "@/utils/formatContent";
import { formatDate } from "@/utils/date";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { CommentForm } from "./CommentForm";
import Link from "next/link";
import { useState } from "react";

type CommentListProps = {
  comments: Comment[];
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
  editingCommentId: string | null;
  editingContent: string;
  onEditingContentChange: (content: string) => void;
  onUpdate: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export function CommentList({
  comments,
  onEdit,
  onDelete,
  editingCommentId,
  editingContent,
  onEditingContentChange,
  onUpdate,
  onCancelEdit,
  onKeyDown,
}: CommentListProps) {
  const { currentUser } = useCurrentUserContext();
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {comments.map((comment) => (
        <div key={comment.id} className="group flex gap-2">
          <Link href={`/u/${comment.users?.id || ""}`}>
            <div
              className="flex items-center group/icon"
              onMouseEnter={() => setHoveredUserId(comment.users?.id)}
              onMouseLeave={() => setHoveredUserId(null)}
            >
              <Avatar
                className={`w-8 h-8 flex-shrink-0 group-hover/icon:translate-y-[-2px] transition-transform ${
                  hoveredUserId === comment.users?.id
                    ? "translate-y-[-2px]"
                    : ""
                }`}
              >
                <AvatarImage
                  src={comment.users?.thumbnail_url || ""}
                  alt={comment.users?.name || ""}
                />
                <AvatarFallback>
                  {comment.users?.name?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
          </Link>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link href={`/u/${comment.users?.id || ""}`}>
                  <span
                    className={`text-sm font-medium text-muted-foreground hover:underline ${
                      hoveredUserId === comment.users?.id ? "underline" : ""
                    }`}
                    onMouseEnter={() => setHoveredUserId(comment.users?.id)}
                    onMouseLeave={() => setHoveredUserId(null)}
                  >
                    {comment.users?.name}
                  </span>
                </Link>
                <time className="text-xs text-muted-foreground">
                  {formatDate(comment.created_at)}
                </time>
              </div>
              {currentUser?.id === comment.user_id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEdit(comment)}
                      className="gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      編集
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(comment.id)}
                      className="gap-2 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      削除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {editingCommentId === comment.id ? (
              <CommentForm
                value={editingContent}
                onChange={onEditingContentChange}
                onSubmit={onUpdate}
                onKeyDown={onKeyDown}
                isEditing
                onCancel={onCancelEdit}
              />
            ) : (
              <p className="text-sm whitespace-pre-wrap">
                {formatContent(comment.content)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
