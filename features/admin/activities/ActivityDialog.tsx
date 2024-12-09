"use client";

import { useEffect } from "react";
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
import { Badge as BadgeType } from "@/types";
import { badgesService } from "@/services/badges";
import { Checkbox } from "@/components/ui/checkbox";

type ActivityDialogProps = {
  mode: "create" | "edit";
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: ActivityFormState;
  onFormChange: (form: Partial<ActivityFormState>) => void;
  onSubmit: () => Promise<void | { id: string } | undefined>;
  isLoading: boolean;
  activity?: ActivityType;
  type?: "activity" | "recruitment";
  selectedBadges: BadgeType[];
  onSelectedBadgesChange: (badges: BadgeType[]) => void;
};

const getDialogTitle = (
  mode: "create" | "edit",
  type: "activity" | "recruitment" = "activity"
) => {
  const typeText = type === "recruitment" ? "ゆる募" : "活動";
  return `${typeText}の${mode === "create" ? "新規作成" : "編集"}`;
};

const getPlaceholderText = (
  field: "title" | "content",
  type: "activity" | "recruitment" = "activity"
) => {
  const typeText = type === "recruitment" ? "ゆる募" : "活動";
  return `${typeText}の${
    field === "title" ? "タイトル" : "内容"
  }を入力してください`;
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
  selectedBadges,
  onSelectedBadgesChange,
}: ActivityDialogProps) {
  const { badges, fetchBadges } = useBadges();

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  useEffect(() => {
    if (activity?.id) {
      loadActivityBadges();
    } else {
      onSelectedBadgesChange([]);
    }
  }, [activity?.id]);

  const loadActivityBadges = async () => {
    if (!activity?.id) return;
    try {
      const activityBadges = await badgesService.getActivityBadges(activity.id);
      onSelectedBadgesChange(
        activityBadges.map((ab) => ({
          id: ab.badge_id,
          name: ab.badges?.name ?? "",
          value: ab.badges?.value ?? "",
          created_at: ab.badges?.created_at ?? "",
        }))
      );
    } catch (error) {
      console.error("Failed to load activity badges:", error);
    }
  };

  const handleBadgeToggle = (badge: BadgeType) => {
    const isSelected = selectedBadges.some((b) => b.id === badge.id);
    if (isSelected) {
      onSelectedBadgesChange(selectedBadges.filter((b) => b.id !== badge.id));
    } else {
      onSelectedBadgesChange([...selectedBadges, badge]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
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
              <div className="grid grid-cols-2 gap-4 mt-2">
                {badges?.map((badge) => (
                  <div key={badge.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`badge-${badge.id}`}
                      checked={selectedBadges.some((b) => b.id === badge.id)}
                      onCheckedChange={() => handleBadgeToggle(badge)}
                    />
                    <Label
                      htmlFor={`badge-${badge.id}`}
                      className="text-sm font-normal"
                    >
                      {badge.name}
                    </Label>
                  </div>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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
