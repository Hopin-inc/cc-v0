"use client";

import { useState, useEffect } from "react";
import { useBadges } from "@/hooks/useBadges";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TablesInsert } from "@/types/supabase";
import { Badge } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function BadgeManagement() {
  const {
    badges,
    isLoading,
    error,
    clearError,
    fetchBadges,
    createBadge,
    updateBadge,
    deleteBadge,
  } = useBadges();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [formData, setFormData] = useState<TablesInsert<"badges">>({
    name: "",
    value: "",
  });

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBadge) {
      updateBadge(selectedBadge.id, formData);
    } else {
      createBadge(formData);
    }
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedBadge(null);
    setFormData({ name: "", value: "" });
  };

  const handleEdit = (badge: Badge) => {
    setSelectedBadge(badge);
    setFormData({
      name: badge.name,
      value: badge.value,
    });
    setIsOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <Button onClick={clearError}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">バッジ管理</h2>
        <Button onClick={() => setIsOpen(true)}>バッジを作成</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>値</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {badges?.map((badge) => (
              <TableRow key={badge.id}>
                <TableCell className="font-medium">{badge.name}</TableCell>
                <TableCell>{badge.value}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(badge)}
                    >
                      編集
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteBadge(badge.id)}
                    >
                      削除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedBadge ? "バッジを編集" : "バッジを作成"}
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
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="value">値</Label>
                <Textarea
                  id="value"
                  value={formData.value || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                キャンセル
              </Button>
              <Button type="submit">
                {selectedBadge ? "更新" : "作成"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
