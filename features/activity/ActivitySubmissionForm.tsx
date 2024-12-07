"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HalfModal } from "@/components/elements";
import { SendIcon } from "lucide-react";
import { ActivityTypeSelect } from "./ActivityTypeSelect";
import { PhotoUpload } from "./PhotoUpload";
import { SubmissionComplete } from "./SubmissionComplete";
import { useContributionType } from "@/hooks/useContributionType";
import { useActivitySubmission } from "@/hooks/useActivitySubmission";

export const ActivitySubmissionForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: contributionTypes } = useContributionType();
  const {
    selectedType,
    setSelectedType,
    setPhoto,
    isSubmitted,
    isLoading,
    handleSubmit,
    resetForm,
  } = useActivitySubmission();

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 px-8 py-3 rounded-full shadow-lg flex items-center justify-center z-50 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 text-base"
      >
        <SendIcon className="w-5 h-5 mr-2" />
        <span className="font-medium">活動を申請する</span>
      </Button>

      <HalfModal
        isOpen={isOpen}
        onClose={handleClose}
        title={isSubmitted ? "申請完了" : "活動申請"}
      >
        <div className="p-4 space-y-6">
          {isSubmitted ? (
            <SubmissionComplete onClose={handleClose} />
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                活動を申請して、ポイントを獲得しましょう。
                獲得したポイントは様々な特典と交換できます。
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <ActivityTypeSelect
                  value={selectedType}
                  onChange={setSelectedType}
                  conributionTypes={contributionTypes}
                />
                <PhotoUpload onPhotoChange={setPhoto} />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!selectedType || isLoading}
                >
                  {isLoading ? "送信中..." : "送信する"}
                </Button>
              </form>
            </>
          )}
        </div>
      </HalfModal>
    </>
  );
};
