"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ActivityTypeSelect } from "@/features/activity/ActivityTypeSelect";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import { DEFAULT_PROJECT } from "@/config";
import { useContributionType } from "@/hooks/useContributionType";
import { useActivityApply } from "@/hooks/useActivityApply";

export default function ActivityApply() {
  const {
    email,
    setEmail,
    activityType,
    setActivityType,
    photoPreview,
    setPhoto,
    setPhotoPreview,
    isSubmitting,
    handleFile,
    handleSubmit,
  } = useActivityApply();

  const { data: contributionTypes } = useContributionType();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{DEFAULT_PROJECT.name}の活動申請</CardTitle>
          <CardDescription>
            活動を申請して、ポイントを獲得できます。
            申請後にメールに届くリンクをクリックして認証してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>
            <ActivityTypeSelect
              value={activityType}
              onChange={setActivityType}
              conributionTypes={contributionTypes}
              className="space-y-2"
            />
            <div className="space-y-2">
              <Label>写真</Label>
              <div
                className={`border-2 border-dashed rounded-md p-4 transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-input"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.[0]) {
                    handleFile(e.dataTransfer.files[0]);
                  }
                }}
              >
                <label
                  htmlFor="photo"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  {photoPreview ? (
                    <div className="relative w-full aspect-video">
                      <Image
                        src={photoPreview}
                        alt="活動の写真プレビュー"
                        fill
                        className="object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.preventDefault();
                          setPhoto(null);
                          setPhotoPreview(null);
                        }}
                      >
                        削除
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        クリックまたは、ドラッグ＆ドロップで
                        <br />
                        写真をアップロード
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                isSubmitting || !email || !activityType || !photoPreview
              }
            >
              {isSubmitting ? "申請中..." : "活動を申請する"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground mb-2">
              すでにアカウントをお持ちの方は
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">ログイン</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
