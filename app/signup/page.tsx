"use client";

import { SignUpForm } from "@/features/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">アカウント登録</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            メールアドレスとパスワードを入力して登録してください
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
