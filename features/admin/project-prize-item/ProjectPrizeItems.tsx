"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProjectPrizeItems } from "@/hooks/useProjectPrizeItems";
import { ProjectPrizeItem } from "@/types";
import { useCurrentProjectContext } from "@/contexts/ProjectContext";
import { TablesInsert } from "@/types/supabase";
import { toast } from "sonner";
import { formatDate } from "@/utils/date";

const INITIAL_FORM_STATE: TablesInsert<"project_prize_items"> = {
  name: "",
  description: "",
  point: 0,
  project_id: "",
};

export function ProjectPrizeItems() {
  const { currentProject } = useCurrentProjectContext();
  const {
    prizeItems,
    isLoading,
    error,
    clearError,
    fetchPrizeItems,
    createPrizeItem,
    updatePrizeItem,
    deletePrizeItem,
  } = useProjectPrizeItems();

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [formData, setFormData] =
    useState<TablesInsert<"project_prize_items">>(INITIAL_FORM_STATE);

  useEffect(() => {
    if (currentProject?.id) {
      fetchPrizeItems().catch((err) => {
        console.error("Error in fetchPrizeItems:", err);
        toast.error("特典の取得に失敗しました");
      });
    }
  }, [currentProject?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!currentProject?.id) {
        throw new Error("Project is not selected");
      }

      const data: TablesInsert<"project_prize_items"> = {
        ...formData,
        project_id: currentProject.id,
      };

      if (selectedItemId) {
        await updatePrizeItem(selectedItemId, data);
        toast.success("特典を更新しました");
      } else {
        await createPrizeItem(data);
        toast.success("特典を作成しました");
      }
      handleClose();
    } catch (err) {
      console.error("Failed to submit prize item:", err);
      toast.error(
        selectedItemId ? "特典の更新に失敗しました" : "特典の作成に失敗しました"
      );
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedItemId(null);
    setFormData(INITIAL_FORM_STATE);
  };

  const handleEdit = (prizeItem: ProjectPrizeItem) => {
    setSelectedItemId(prizeItem.id);
    setFormData(prizeItem);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteTargetId === null) return;
      await deletePrizeItem(String(deleteTargetId));
      toast.success("特典を削除しました");
      setIsDeleteDialogOpen(false);
      setDeleteTargetId(null);
    } catch (err) {
      console.error("Failed to delete prize item:", err);
      toast.error("特典の削除に失敗しました");
    }
  };

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">エラーが発生しました: {error.message}</p>
        <Button onClick={clearError} variant="outline" size="sm">
          再試行
        </Button>
      </div>
    );
  }

  if (!currentProject?.id) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">特典管理</h2>
        <Button onClick={() => setIsOpen(true)}>新規作成</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>説明</TableHead>
              <TableHead>必要ポイント</TableHead>
              <TableHead>作成日</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  <p>Loading...</p>
                </TableCell>
              </TableRow>
            ) : prizeItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  特典がありません
                </TableCell>
              </TableRow>
            ) : (
              prizeItems?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.point}</TableCell>
                  <TableCell>{formatDate(item.created_at)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      編集
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      削除
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedItemId ? "特典を編集" : "新しい特典を作成"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">名前</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">説明</Label>
                <Textarea
                  id="description"
                  value={formData?.description ?? ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="point">必要ポイント</Label>
                <Input
                  id="point"
                  type="number"
                  value={formData.point}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      point: parseInt(e.target.value, 10),
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                キャンセル
              </Button>
              <Button type="submit">{selectedItemId ? "更新" : "作成"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>特典の削除</DialogTitle>
            <DialogDescription>
              この特典を削除してもよろしいですか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
