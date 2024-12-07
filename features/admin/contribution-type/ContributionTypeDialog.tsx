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
import { ContributionType } from "@/types";
import { ContributionTypeFormState } from "./types";

interface ContributionTypeDialogProps {
  mode: "create" | "edit";
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: ContributionTypeFormState;
  onFormChange: (form: Partial<ContributionTypeFormState>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  type?: ContributionType;
}

export function ContributionTypeDialog({
  mode,
  isOpen,
  onOpenChange,
  form,
  onFormChange,
  onSubmit,
  isLoading,
}: ContributionTypeDialogProps) {
  const isEdit = mode === "edit";
  const dialogTitle = isEdit ? "活動種別を編集" : "活動種別を作成";
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
            <label htmlFor="name">名前</label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
              placeholder="活動種別の名前を入力"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="value">値</label>
            <Input
              id="value"
              value={form.value}
              onChange={(e) => onFormChange({ value: e.target.value })}
              placeholder="活動種別の値を入力"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="point">ポイント</label>
            <Input
              id="point"
              type="number"
              value={form.point}
              onChange={(e) =>
                onFormChange({ point: parseInt(e.target.value, 10) || 0 })
              }
              placeholder="ポイントを入力"
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
