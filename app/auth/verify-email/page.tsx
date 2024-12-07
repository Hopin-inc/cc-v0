"use client";

import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md p-8 space-y-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">メールを確認してください</h1>
          <p className="text-muted-foreground">
            登録確認メールを送信しました。メール内のリンクをクリックして、アカウントの認証を完了してください。
          </p>
          <p className="text-sm text-muted-foreground">
            メールが届かない場合は、迷惑メールフォルダをご確認ください。
          </p>
        </div>
      </Card>
    </div>
  );
}
