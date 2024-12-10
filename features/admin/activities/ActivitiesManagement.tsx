"use client";

import { useEffect, useState } from "react";
import { useAdminActivity } from "@/hooks/admin/useAdminActivity";
import { useAdminActivityMutation } from "@/hooks/admin/useAdminActivityMutation";
import { useAdminActivityBadgeMutation } from "@/hooks/admin/useAdminActivityBadgeMutation";
import { ActivityType, FeedItem, Badge as BadgeType } from "@/types";
import { toast } from "sonner";
import { ActivityDialog } from "./ActivityDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useCurrentProject } from "@/hooks/useCurrentProject";
import { useCurrentUserContext } from "@/contexts/UserContext";
import {
  ActivityFormState,
  createActivityFormFromActivity,
  initialActivityFormState,
} from "./types";
import { formatDate } from "@/utils/date";
import { DeleteConfirmDialog } from "@/components/elements/DeleteConfirmDialog";

export const ActivitiesManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [form, setForm] = useState<ActivityFormState>(initialActivityFormState);
  const handleSetForm = (form: Partial<ActivityFormState>) => {
    setForm((prev) => ({
      ...prev,
      ...form,
    }));
  };
  const [editingActivity, setEditingActivity] = useState<ActivityType | null>(
    null
  );
  const [activities, setActivities] = useState<FeedItem[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<BadgeType[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  );
  const { currentProject } = useCurrentProject();
  const { currentUser } = useCurrentUserContext();

  const { fetchAll, isLoading: isFetchLoading } = useAdminActivity();
  const {
    create,
    update,
    remove,
    isLoading: isMutationLoading,
    error,
  } = useAdminActivityMutation();
  const { assignBadges, isLoading: isBadgeMutationLoading } =
    useAdminActivityBadgeMutation();

  useEffect(() => {
    if (currentProject?.id) {
      loadData();
    }
  }, [currentProject?.id]);

  const loadData = async () => {
    if (!currentProject?.id) return;
    try {
      const data = await fetchAll(currentProject.id, "contribution");
      // @ts-ignore
      setActivities(data);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("データの読み込みに失敗しました");
    }
  };

  const handleCreate = async () => {
    if (!form.title || !currentProject?.id || !currentUser?.id) {
      toast.error("タイトルは必須です");
      return;
    }

    try {
      const result = await create({
        title: form.title,
        content: form.content ?? "",
        date: form.date ?? "",
        location: form.location ?? "",
        project_id: currentProject.id,
        created_by_user_id: currentUser.id,
        type: "contribution",
      });
      await assignBadges(result.id, selectedBadges);
      setIsCreateDialogOpen(false);
      resetForm();
      loadData();
      toast.success("活動を作成しました");
    } catch (error) {
      console.error("Failed to create activity:", error);
      toast.error("活動を作成できませんでした");
    }
  };

  const handleEdit = async () => {
    if (!editingActivity || !form.title) {
      toast.error("タイトルは必須です");
      return;
    }

    try {
      await update(editingActivity.id, {
        title: form.title,
        content: form.content ?? undefined,
        date: form.date ?? undefined,
        location: form.location ?? undefined,
      });
      await assignBadges(editingActivity.id, selectedBadges);
      setIsEditDialogOpen(false);
      setEditingActivity(null);
      resetForm();
      loadData();
      toast.success("活動を更新しました");
    } catch (error) {
      console.error("Failed to update activity:", error);
      toast.error("活動を更新できませんでした");
    }
  };

  const handleDelete = async () => {
    if (!selectedActivityId) return;
    try {
      await remove(selectedActivityId);
      toast.success("活動を削除しました");
      setIsDeleteDialogOpen(false);
      loadData();
    } catch (error) {
      toast.error("活動の削除に失敗しました");
    }
  };

  const handleDeleteClick = (activityId: string) => {
    setSelectedActivityId(activityId);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setForm(initialActivityFormState);
    setSelectedBadges([]);
  };

  const startEdit = (activity: ActivityType) => {
    setEditingActivity(activity);
    setForm(createActivityFormFromActivity(activity));
    setSelectedBadges(activity.badges || []);
    setIsEditDialogOpen(true);
  };

  if (!currentProject) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">活動管理</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>新規作成</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">日付</TableHead>
              <TableHead className="w-[200px]">タイトル</TableHead>
              <TableHead className="min-w-[300px]">内容</TableHead>
              <TableHead className="w-[120px]">場所</TableHead>
              <TableHead className="w-[120px]">バッジ</TableHead>
              <TableHead className="w-[120px]">作成日</TableHead>
              <TableHead className="w-[120px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="whitespace-nowrap">{activity.date}</TableCell>
                <TableCell className="whitespace-nowrap">{activity.title}</TableCell>
                <TableCell className="whitespace-pre-wrap">{activity.content}</TableCell>
                <TableCell className="whitespace-nowrap">{activity.location}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {activity.activity_badges?.map((activityBadge) => (
                      <div
                        key={activityBadge.badge_id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                      >
                        {activityBadge.badges.name}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">{formatDate(activity.created_at)}</TableCell>
                <TableCell className="whitespace-nowrap text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(activity)}
                  >
                    編集
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(activity.id)}
                  >
                    削除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ActivityDialog
        mode="create"
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        form={form}
        onFormChange={handleSetForm}
        onSubmit={handleCreate}
        isLoading={isMutationLoading || isBadgeMutationLoading}
        selectedBadges={selectedBadges}
        onSelectedBadgesChange={setSelectedBadges}
      />

      {editingActivity && (
        <ActivityDialog
          mode="edit"
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          form={form}
          onFormChange={handleSetForm}
          onSubmit={handleEdit}
          isLoading={isMutationLoading || isBadgeMutationLoading}
          activity={editingActivity}
          selectedBadges={selectedBadges}
          onSelectedBadgesChange={setSelectedBadges}
        />
      )}

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="活動の削除"
        description="この活動を削除してもよろしいですか？この操作は取り消せません。"
      />
    </div>
  );
};
