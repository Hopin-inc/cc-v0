"use client";

import { useEffect, useState } from "react";
import { useAdminActivity } from "@/hooks/admin/useAdminActivity";
import { useAdminActivityMutation } from "@/hooks/admin/useAdminActivityMutation";
import { useAdminActivityBadgeMutation } from "@/hooks/admin/useAdminActivityBadgeMutation";
import { ActivityType, FeedItem, Badge as BadgeType } from "@/types";
import { toast } from "sonner";
import { ActivityDialog } from "../activities/ActivityDialog";
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
} from "../activities/types";
import { formatDate } from "@/utils/date";

export const RecruitmentsManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [form, setForm] = useState<ActivityFormState>(initialActivityFormState);
  const hadleSetForm = (form: Partial<ActivityFormState>) => {
    setForm((prev) => ({
      ...prev,
      ...form,
    }));
  };
  const [editingActivity, setEditingActivity] = useState<ActivityType | null>(
    null
  );
  const [recruitments, setRecruitments] = useState<FeedItem[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<BadgeType[]>([]);
  const { currentProject } = useCurrentProject();
  const { currentUser } = useCurrentUserContext();

  const { fetchAll } = useAdminActivity();
  const {
    create,
    update,
    remove,
    isLoading: isMutationLoading,
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
      const data = await fetchAll(currentProject.id, "recruitment");
      // @ts-ignore
      setRecruitments(data);
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
        type: "recruitment",
        created_by_user_id: currentUser.id,
      });
      await assignBadges(result.id, selectedBadges);
      setIsCreateDialogOpen(false);
      resetForm();
      loadData();
      toast.success("ゆる募を作成しました");
      return result;
    } catch (error) {
      console.error("Failed to create recruitment:", error);
      toast.error("ゆる募を作成できませんでした");
    }
  };

  const handleEdit = async () => {
    if (!editingActivity || !form.title) {
      toast.error("タイトルは必須です");
      return;
    }

    try {
      const result = await update(editingActivity.id, {
        title: form.title,
        content: form.content ?? undefined,
        date: form.date ?? undefined,
        location: form.location ?? undefined,
      });
      await assignBadges(editingActivity.id, selectedBadges);
      setIsEditDialogOpen(false);
      resetForm();
      setEditingActivity(null);
      loadData();
      toast.success("ゆる募を更新しました");
      return result;
    } catch (error) {
      console.error("Failed to update recruitment:", error);
      toast.error("ゆる募を更新できませんでした");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("本当に削除しますか？")) return;

    try {
      await remove(id);
      loadData();
      toast.success("ゆる募を削除しました");
    } catch (error) {
      console.error("Failed to delete recruitment:", error);
      toast.error("ゆる募を削除できませんでした");
    }
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
        <h2 className="text-2xl font-bold">ゆる募管理</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>新規作成</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日付</TableHead>
              <TableHead>タイトル</TableHead>
              <TableHead>内容</TableHead>
              <TableHead>場所</TableHead>
              <TableHead>作成日</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recruitments.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.date}</TableCell>
                <TableCell>{activity.title}</TableCell>
                <TableCell>{activity.content}</TableCell>
                <TableCell>{activity.location}</TableCell>
                <TableCell>{formatDate(activity.created_at)}</TableCell>
                <TableCell className="text-right space-x-2">
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
                    onClick={() => handleDelete(activity.id)}
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
        onFormChange={hadleSetForm}
        onSubmit={handleCreate}
        isLoading={isMutationLoading || isBadgeMutationLoading}
        type="recruitment"
        selectedBadges={selectedBadges}
        onSelectedBadgesChange={setSelectedBadges}
      />

      {editingActivity && (
        <ActivityDialog
          mode="edit"
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          form={form}
          onFormChange={hadleSetForm}
          onSubmit={handleEdit}
          isLoading={isMutationLoading || isBadgeMutationLoading}
          activity={editingActivity}
          type="recruitment"
          selectedBadges={selectedBadges}
          onSelectedBadgesChange={setSelectedBadges}
        />
      )}
    </div>
  );
};
