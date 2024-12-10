"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContributionStatus, UserContribution } from "@/types";
import { Activity } from "./types";
import Image from "next/image";
import { formatDate } from "@/utils/date";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/elements/DeleteConfirmDialog";
import { useState } from "react";
import { useAdminContributionMutation } from "@/hooks/admin/useAdminContributionMutation";

type ContributionsTableProps = {
  contributions: UserContribution[];
  activities: Activity[];
  isLoading: boolean;
  onActivityChange: (contributionId: string, activityId: string) => void;
  onStatusChange: (contributionId: string, status: ContributionStatus) => void;
  onRefresh: () => void;
};

export const ContributionsTable = ({
  contributions,
  activities,
  isLoading,
  onActivityChange,
  onStatusChange,
  onRefresh,
}: ContributionsTableProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContributionId, setSelectedContributionId] = useState<
    string | null
  >(null);
  const { remove } = useAdminContributionMutation();

  const handleDelete = async () => {
    if (!selectedContributionId) return;
    try {
      await remove(selectedContributionId);
      setIsDeleteDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (contributionId: string) => {
    setSelectedContributionId(contributionId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>日付</TableHead>
            <TableHead>ユーザー</TableHead>
            <TableHead>写真</TableHead>
            <TableHead>活動</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contributions.map((contribution) => (
            <TableRow key={contribution.id}>
              <TableCell>{formatDate(contribution.created_at)}</TableCell>
              <TableCell className="flex items-center space-x-2">
                <span>{contribution.users?.name}</span>
              </TableCell>
              <TableCell>
                {contribution?.user_photos?.map((userPhoto) => (
                  <Image
                    key={userPhoto.id}
                    src={userPhoto.url}
                    alt={userPhoto.url}
                    width={50}
                    height={50}
                  />
                ))}
              </TableCell>
              <TableCell>
                <Select
                  value={contribution.activity_id ?? undefined}
                  onValueChange={(value) =>
                    onActivityChange(contribution.id, value)
                  }
                  disabled={isLoading || contribution.status === "approved"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="活動を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {activities.map((activity) => (
                      <SelectItem key={activity.id} value={activity.id}>
                        {activity.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={contribution.status?.replace(/"/g, "") ?? "claimed"}
                  onValueChange={(value) =>
                    onStatusChange(contribution.id, value as ContributionStatus)
                  }
                  disabled={
                    isLoading ||
                    contribution.status === "approved" ||
                    contribution.activity_id === null
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claimed">
                      <span>申請中</span>
                    </SelectItem>
                    <SelectItem value="approved">
                      <span>承認済み</span>
                    </SelectItem>
                    <SelectItem value="rejected">
                      <span>却下</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(contribution.id)}
                  >
                    削除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="申請の削除"
        description="この申請を削除してもよろしいですか？この操作は取り消せません。"
      />
    </div>
  );
};
