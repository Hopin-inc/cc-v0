"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [isResetOpen, setIsResetOpen] = useState(false);
  const { signIn, resetPassword, isLoading } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("メールアドレスを入力してください");
      return;
    }

    if (!validateEmail(email)) {
      setError("有効なメールアドレスを入力してください");
      return;
    }

    if (!password) {
      setError("パスワードを入力してください");
      return;
    }

    try {
      await signIn(email, password);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!resetEmail) {
      setError("メールアドレスを入力してください");
      return;
    }

    if (!validateEmail(resetEmail)) {
      setError("有効なメールアドレスを入力してください");
      return;
    }

    try {
      await resetPassword(resetEmail);
      setIsResetOpen(false);
    } catch (err) {
      console.error("Password reset error:", err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          ログイン
        </Button>
        <div className="text-center space-y-2">
          <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
            <DialogTrigger asChild>
              <Button variant="link" className="text-sm">
                パスワードを忘れた場合
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>パスワードをリセット</DialogTitle>
                <DialogDescription>
                  登録したメールアドレスを入力してください。パスワードリセット用のメールを送信します。
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <Input
                  type="email"
                  placeholder="メールアドレス"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  disabled={isLoading}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  送信
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <p className="text-sm text-muted-foreground">
            アカウントをお持ちでない場合は{" "}
            <Link href="/signup" className="text-primary hover:underline">
              新規登録
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
