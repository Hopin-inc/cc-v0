"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { storageService } from "@/services";
import { toast } from "sonner";

interface PhotoUploadProps {
  onPhotoChange: (file: File | null) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoChange }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    try {
      storageService.validateFile(file);
      onPhotoChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ファイルの処理に失敗しました");
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleRemovePhoto = () => {
    onPhotoChange(null);
    setPhotoPreview(null);
  };

  return (
    <div className="space-y-2">
      <Label>写真（任意）</Label>
      <div
        className={`mt-2 border-2 border-dashed rounded-lg transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {photoPreview ? (
          <div className="relative aspect-video">
            <Image
              src={photoPreview}
              alt="活動の写真プレビュー"
              fill
              className="object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemovePhoto}
            >
              削除
            </Button>
          </div>
        ) : (
          <label
            htmlFor="photo"
            className="flex flex-col items-center justify-center h-40 cursor-pointer"
          >
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground text-center">
              クリックまたはドラッグ&ドロップで
              <br />
              写真をアップロード
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              JPG、JPEG、PNG形式（10MB以下）
            </span>
            <input
              type="file"
              id="photo"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};
