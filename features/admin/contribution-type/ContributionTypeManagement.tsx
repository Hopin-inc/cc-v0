"use client";

import { useEffect, useState } from "react";
import { useAdminContributionType } from "@/hooks/admin/useAdminContributionType";
import { useAdminContributionTypeMutation } from "@/hooks/admin/useAdminContributionTypeMutation";
import { ContributionType } from "@/types";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ContributionTypeDialog } from "./ContributionTypeDialog";
import {
  ContributionTypeFormState,
  createContributionTypeFormFromType,
  initialContributionTypeFormState,
} from "./types";

export const ContributionTypeManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [form, setForm] = useState<ContributionTypeFormState>(
    initialContributionTypeFormState
  );
  const [editingType, setEditingType] = useState<ContributionType | null>(null);
  const [contributionTypes, setContributionTypes] = useState<
    ContributionType[]
  >([]);

  const { fetchAll, isLoading: isFetchLoading } = useAdminContributionType();
  const {
    create,
    update,
    remove,
    isLoading: isMutationLoading,
  } = useAdminContributionTypeMutation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchAll();
      setContributionTypes(data);
    } catch (error) {
      console.error("Error loading contribution types:", error);
      toast.error("データの読み込みに失敗しました");
    }
  };

  const handleCreate = async () => {
    if (!form.name || !form.value) {
      toast.error("名前と値は必須です");
      return;
    }

    try {
      await create({
        name: form.name,
        value: form.value,
        point: form.point,
      });
      setIsCreateDialogOpen(false);
      setForm(initialContributionTypeFormState);
      loadData();
      toast.success("活動種別を作成しました");
    } catch (error) {
      console.error("Error creating contribution type:", error);
      toast.error("活動種別の作成に失敗しました");
    }
  };

  const handleEdit = async () => {
    if (!editingType || !form.name || !form.value) {
      toast.error("名前と値は必須です");
      return;
    }

    try {
      await update(editingType.id, {
        name: form.name,
        value: form.value,
        point: form.point,
      });
      setIsEditDialogOpen(false);
      setEditingType(null);
      setForm(initialContributionTypeFormState);
      loadData();
      toast.success("活動種別を更新しました");
    } catch (error) {
      console.error("Error updating contribution type:", error);
      toast.error("活動種別の更新に失敗しました");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("本当に削除しますか？")) return;

    try {
      await remove(id);
      loadData();
      toast.success("活動種別を削除しました");
    } catch (error) {
      console.error("Error deleting contribution type:", error);
      toast.error("活動種別の削除に失敗しました");
    }
  };

  const resetForm = () => {
    setForm(initialContributionTypeFormState);
  };

  const startEdit = (type: ContributionType) => {
    setEditingType(type);
    setForm(createContributionTypeFormFromType(type));
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">活動種別管理</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>新規作成</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>値</TableHead>
              <TableHead>ポイント</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributionTypes.map((type) => (
              <TableRow key={type.id}>
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.value}</TableCell>
                <TableCell>{type.point}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(type)}
                  >
                    編集
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(type.id)}
                  >
                    削除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ContributionTypeDialog
        mode="create"
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        form={form}
        onFormChange={(changes) => setForm((prev) => ({ ...prev, ...changes }))}
        onSubmit={handleCreate}
        isLoading={isMutationLoading}
      />

      {editingType && (
        <ContributionTypeDialog
          mode="edit"
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          form={form}
          onFormChange={(changes) =>
            setForm((prev) => ({ ...prev, ...changes }))
          }
          onSubmit={handleEdit}
          isLoading={isMutationLoading}
          type={editingType}
        />
      )}
    </div>
  );
};
