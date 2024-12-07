"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SubmissionCompleteProps {
  onClose: () => void;
}

export const SubmissionComplete: React.FC<SubmissionCompleteProps> = ({
  onClose,
}) => {
  return (
    <div className="text-center space-y-4">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      <h3 className="text-lg font-semibold">申請を受け付けました</h3>
      <p className="text-sm text-muted-foreground">
        運営メンバーの承認がされたらポイントが獲得されます。通知でお知らせします。
      </p>
      <Button onClick={onClose} className="w-full">
        閉じる
      </Button>
    </div>
  );
};
