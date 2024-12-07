import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Comment } from "@/types";

type CommentSectionProps = {
  comments: Comment[];
  onAddComment: (comment: string) => void;
  isLoading?: boolean;
};

export function CommentSection({
  comments,
  onAddComment,
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
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        {isExpanded
          ? "コメントを閉じる"
          : `コメントを表示 (${comments.length})`}
      </button>
      {isExpanded && (
        <>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start space-x-2 mb-2 mt-2"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={comment.user.avatar}
                  alt={comment.user.name}
                />
                <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{comment.user.name}</p>
                <p className="text-sm text-gray-600">{comment.content}</p>
              </div>
            </div>
          ))}
          <form onSubmit={handleSubmit} className="flex items-center mt-2">
            <Input
              type="text"
              placeholder="コメントを追加..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-grow mr-2"
            />
            <Button type="submit">送信</Button>
          </form>
        </>
      )}
    </div>
  );
}
