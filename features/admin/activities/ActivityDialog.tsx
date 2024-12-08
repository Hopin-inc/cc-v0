"use client";

import { ActivityType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ActivityFormState } from "./types";

type ActivityDialogProps = {
  mode: "create" | "edit";
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: ActivityFormState;
  onFormChange: (form: Partial<ActivityFormState>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  activity?: ActivityType;
  type?: "activity" | "recruitment";
};

const getDialogTitle = (mode: "create" | "edit", type: "activity" | "recruitment" = "activity") => {
  const typeText = type === "recruitment" ? "ゆる募" : "活動";
  return `${typeText}の${mode === "create" ? "新規作成" : "編集"}`;
};

const getPlaceholderText = (field: "title" | "content", type: "activity" | "recruitment" = "activity") => {
  const typeText = type === "recruitment" ? "ゆる募" : "活動";
  return `${typeText}の${field === "title" ? "タイトル" : "内容"}を入力してください`;
};

export function ActivityDialog({
  mode,
  isOpen,
  onOpenChange,
  form,
  onFormChange,
  onSubmit,
  isLoading,
  activity,
  type = "activity",
}: ActivityDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getDialogTitle(mode, type)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => onFormChange({ title: e.target.value })}
              placeholder={getPlaceholderText("title", type)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">内容</Label>
            <Textarea
              id="content"
              value={form.content}
              onChange={(e) => onFormChange({ content: e.target.value })}
              placeholder={getPlaceholderText("content", type)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">日付</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => onFormChange({ date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">場所</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => onFormChange({ location: e.target.value })}
              placeholder="場所を入力してください"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            キャンセル
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {mode === "create" ? "作成" : "更新"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
