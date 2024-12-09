"use client";

import { useEffect, useState } from "react";
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
import { useBadges } from "@/hooks/useBadges";
import { Badge } from "@/types";
import { badgesService } from "@/services/badges";

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
  const { badges, fetchBadges } = useBadges();
  const [selectedBadges, setSelectedBadges] = useState<Badge[]>([]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  useEffect(() => {
    if (activity?.id) {
      loadActivityBadges();
    }
  }, [activity?.id]);

  const loadActivityBadges = async () => {
    if (!activity?.id) return;
    try {
      const activityBadges = await badgesService.getActivityBadges(activity.id);
      setSelectedBadges(activityBadges.map((ab) => ab.badges));
    } catch (error) {
      console.error('Failed to load activity badges:', error);
    }
  };

  const handleBadgeToggle = (badge: Badge) => {
    const isSelected = selectedBadges.some((b) => b.id === badge.id);
    if (isSelected) {
      setSelectedBadges(selectedBadges.filter((b) => b.id !== badge.id));
    } else {
      setSelectedBadges([...selectedBadges, badge]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
    if (activity?.id) {
      // 既存のバッジを全て削除
      const currentBadges = await badgesService.getActivityBadges(activity.id);
      await Promise.all(
        currentBadges.map((ab) =>
          badgesService.removeBadgeFromActivity(activity.id, ab.badge_id)
        )
      );
      // 選択されたバッジを追加
      await Promise.all(
        selectedBadges.map((badge) =>
          badgesService.assignBadgeToActivity(activity.id, badge.id)
        )
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getDialogTitle(mode, type)}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => onFormChange({ title: e.target.value })}
                placeholder={getPlaceholderText("title", type)}
                required
              />
            </div>
            <div>
              <Label htmlFor="content">内容</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => onFormChange({ content: e.target.value })}
                placeholder={getPlaceholderText("content", type)}
              />
            </div>
            <div>
              <Label>バッジ</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {badges?.map((badge) => (
                  <Button
                    key={badge.id}
                    type="button"
                    variant={selectedBadges.some((b) => b.id === badge.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleBadgeToggle(badge)}
                  >
                    {badge.name}
                  </Button>
                ))}
              </div>
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
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading}>
              {mode === "create" ? "作成" : "更新"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
