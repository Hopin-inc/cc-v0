"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ActivityType } from "@/types";
import { ActivityFormState } from "./types";

interface ActivityDialogProps {
  mode: "create" | "edit";
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: ActivityFormState;
  onFormChange: (form: Partial<ActivityFormState>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  activity?: ActivityType;
}

export function ActivityDialog({
  mode,
  isOpen,
  onOpenChange,
  form,
  onFormChange,
  onSubmit,
  isLoading,
}: ActivityDialogProps) {
  const isEdit = mode === "edit";
  const dialogTitle = isEdit ? "活動を編集" : "活動を作成";
  const buttonText = isEdit ? "更新" : "作成";
  const loadingText = isEdit ? "更新中..." : "作成中...";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title">タイトル</label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => onFormChange({ title: e.target.value })}
              placeholder="活動のタイトルを入力"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="content">内容</label>
            <Textarea
              id="content"
              value={form.content}
              onChange={(e) => onFormChange({ content: e.target.value })}
              placeholder="活動の内容を入力"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="date">日付</label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => onFormChange({ date: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="location">場所</label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => onFormChange({ location: e.target.value })}
              placeholder="活動の場所を入力"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? loadingText : buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
