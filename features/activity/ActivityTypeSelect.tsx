"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ContributionType } from "@/types";

interface ActivityTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  conributionTypes: ContributionType[];
  className?: string;
}

export const ActivityTypeSelect: React.FC<ActivityTypeSelectProps> = ({
  value,
  onChange,
  conributionTypes,
  className,
}) => {
  return (
    <div className={`space-y-2 ${className || ""}`}>
      <Label htmlFor="activityType">活動種別</Label>
      <div className="relative">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id="activityType">
            <SelectValue placeholder="活動種別を選択してください" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[100]">
            {conributionTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name} ({type.point}pt)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
