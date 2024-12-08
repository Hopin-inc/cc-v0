"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { storageService } from "@/services";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface PhotoUploadProps {
  onPhotoChange: (files: File[]) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoChange }) => {
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList) => {
    try {
      const newPhotos = Array.from(files).map((file) => {
        storageService.validateFile(file);
        return new Promise<{ file: File; preview: string }>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              file,
              preview: reader.result as string,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newPhotos).then((results) => {
        setPhotos((prev) => {
          const updated = [...prev, ...results];
          onPhotoChange(updated.map((p) => p.file));
          return updated;
        });
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ファイルの処理に失敗しました");
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onPhotoChange(updated.map((p) => p.file));
      return updated;
    });
  };

  return (
    <div className="space-y-2">
      <Label>写真（任意・複数可）</Label>
      {photos.length > 0 && (
        <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
          <div className="flex w-max space-x-4 p-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative w-40 h-40 shrink-0">
                <Image
                  src={photo.preview}
                  alt={`活動の写真 ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => handleRemovePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
      <div
        className={`mt-2 border-2 border-dashed rounded-lg transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
            multiple
            className="hidden"
            onChange={handlePhotoChange}
          />
        </label>
      </div>
    </div>
  );
};
