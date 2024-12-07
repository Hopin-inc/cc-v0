"use client";

import { useEffect, useState } from "react";
import { useAdminActivity } from "@/hooks/admin/useAdminActivity";
import { useAdminActivityMutation } from "@/hooks/admin/useAdminActivityMutation";
import { ActivityType, FeedItem } from "@/types";
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
import {
  ActivityFormState,
  createActivityFormFromActivity,
  initialActivityFormState,
} from "./types";

export const ActivitiesManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [form, setForm] = useState<ActivityFormState>(initialActivityFormState);
  const [editingActivity, setEditingActivity] = useState<ActivityType | null>(
    null
  );
  const [activities, setActivities] = useState<FeedItem[]>([]);
  const { currentProject } = useCurrentProject();

  const { fetchAll, isLoading: isFetchLoading } = useAdminActivity();
  const {
    create,
    update,
    remove,
    isLoading: isMutationLoading,
    error,
  } = useAdminActivityMutation();

  useEffect(() => {
    if (currentProject?.id) {
      loadData();
    }
  }, [currentProject?.id]);

  const loadData = async () => {
    if (!currentProject?.id) return;
    try {
      const data = await fetchAll(currentProject.id);
  
      // @ts-ignore
      setActivities(data);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("データの読み込みに失敗しました");
    }
  };

  const handleCreate = async () => {
    if (!form.title || !currentProject?.id) {
      toast.error("タイトルは必須です");
      return;
    }

    try {
      await create({
        title: form.title,
        content: form.content ?? "",
        date: form.date ?? "",
        location: form.location ?? "",
        project_id: currentProject.id,
      });
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

  const handleDelete = async (id: string) => {
    if (!window.confirm("本当に削除しますか？")) return;

    try {
      await remove(id);
      loadData();
      toast.success("活動を削除しました");
    } catch (error) {
      console.error("Failed to delete activity:", error);
      toast.error("活動を削除できませんでした");
    }
  };

  const resetForm = () => {
    setForm(initialActivityFormState);
  };

  const startEdit = (activity: ActivityType) => {
    setEditingActivity(activity);
    setForm(createActivityFormFromActivity(activity));
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
              <TableHead>日付</TableHead>
              <TableHead>タイトル</TableHead>
              <TableHead>内容</TableHead>
              <TableHead>場所</TableHead>
              <TableHead>作成日</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.date}</TableCell>
                <TableCell>{activity.title}</TableCell>
                <TableCell>{activity.content}</TableCell>
                <TableCell>{activity.location}</TableCell>
                <TableCell>
                  {new Date(activity.created_at).toLocaleDateString()}
                </TableCell>
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
        onFormChange={(changes) => setForm((prev) => ({ ...prev, ...changes }))}
        onSubmit={handleCreate}
        isLoading={isMutationLoading}
      />

      {editingActivity && (
        <ActivityDialog
          mode="edit"
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          form={form}
          onFormChange={(changes) =>
            setForm((prev) => ({ ...prev, ...changes }))
          }
          onSubmit={handleEdit}
          isLoading={isMutationLoading}
          activity={editingActivity}
        />
      )}
    </div>
  );
};
