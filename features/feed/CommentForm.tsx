"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCurrentUserContext } from "@/contexts/UserContext";

type CommentFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isEditing?: boolean;
  onCancel?: () => void;
};

export function CommentForm({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  isEditing,
  onCancel,
}: CommentFormProps) {
  const { currentUser } = useCurrentUserContext();

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      {!isEditing && (
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={currentUser?.thumbnail_url || ""}
            alt={currentUser?.name || ""}
          />
          <AvatarFallback>{currentUser?.name?.slice(0, 2)}</AvatarFallback>
        </Avatar>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={isEditing ? "" : "コメントを追加..."}
        className="flex-1 min-h-[40px] px-3 py-2 bg-muted rounded-md resize-y"
      />
      <div className="space-y-2">
        <Button type="submit" size="sm" disabled={!value.trim()}>
          {isEditing ? "更新" : "送信"}
        </Button>
        {isEditing && onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            キャンセル
          </Button>
        )}
      </div>
    </form>
  );
}
