"use client";

import { LoginForm } from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">ログイン</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            メールアドレスとパスワードを入力してログインしてください
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
