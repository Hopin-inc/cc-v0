"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { formatDate } from "@/utils/date";
import { CommentList } from "@/features/feed/CommentList";
import { CommentForm } from "@/features/feed/CommentForm";
import { useActivityComments } from "@/hooks/useActivityComments";
import { Comment } from "@/types";

interface PhotoAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Array<{
    url: string;
    user_id: string;
  }>;
  users: Array<{
    id: string;
    name: string;
    thumbnail_url: string;
  }>;
  activityName: string;
  date: string | null;
  location: string | null;
  activityId: string;
}

export function PhotoAlbumModal({
  isOpen,
  onClose,
  photos,
  users,
  activityName,
  date,
  location,
  activityId,
}: PhotoAlbumModalProps) {
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const { comments, addComment, updateComment, deleteComment } =
    useActivityComments(activityId || "");

  useEffect(() => {
    if (isOpen) {
      window.scrollTo(0, 0);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(newComment.trim());
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
      updateComment(editingCommentId, editingContent.trim());
      setEditingCommentId(null);
      setEditingContent("");
    }
  };

  const handleDelete = (commentId: string) => {
    if (window.confirm("このコメントを削除してもよろしいですか？")) {
      deleteComment(commentId);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto p-0 rounded-xl overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 items-start">
          <DialogTitle className="text-xl font-semibold">
            {activityName}
          </DialogTitle>
          <div className="flex items-center">
            <div className="text-sm text-muted-foreground">
              <span>{formatDate(date ?? "")}</span> • <span>{location}</span>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="px-6 space-y-8">
            {(photos ?? []).map((photo, index) => {
              const user = users?.find((u) => u.id === photo.user_id);
              return (
                <div key={index} className="relative">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={photo.url}
                      alt={`${activityName} - 写真 ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                    {user && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 rounded-b-lg">
                        <Link href={`/u/${user.id}`}>
                          <div className="flex items-center group">
                            <Avatar className="w-8 h-8 border-2 border-white/80 shadow-md group-hover:translate-y-[-2px] transition-transform">
                              <AvatarImage
                                src={user.thumbnail_url}
                                alt={user.name}
                              />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="ml-2 text-sm font-medium text-white drop-shadow-md group-hover:underline">
                              {user.name}
                            </span>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">コメント</h3>
                <span className="text-sm text-muted-foreground">
                  {comments.length}件
                </span>
              </div>
              <div className="space-y-4">
                <div className="mt-4 mb-8 space-y-4 pl-4 border-l-2 border-gray-100">
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
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
