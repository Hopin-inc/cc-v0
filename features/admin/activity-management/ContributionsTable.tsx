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

type ContributionsTableProps = {
  contributions: UserContribution[];
  activities: Activity[];
  isLoading: boolean;
  onActivityChange: (contributionId: string, activityId: string) => void;
  onStatusChange: (contributionId: string, status: ContributionStatus) => void;
};

export const ContributionsTable = ({
  contributions,
  activities,
  isLoading,
  onActivityChange,
  onStatusChange,
}: ContributionsTableProps) => {
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {contributions.map((contribution) => (
            <TableRow key={contribution.id}>
              <TableCell>
                {new Date(contribution.created_at).toLocaleDateString()}
              </TableCell>
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
                  disabled={isLoading || contribution.status === "approved"}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
