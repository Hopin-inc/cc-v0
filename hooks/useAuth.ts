import { useState } from "react";
import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.signUp(email, password);
      toast.success(
        "登録確認メールを送信しました。メールを確認して認証を完了してください。"
      );
      router.push("/auth/verify-email");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "登録に失敗しました"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.signIn(email, password);
      toast.success("ログインしました");
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ログインに失敗しました"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      toast.success("ログアウトしました");
      router.push("/login");
    } catch (error) {
      toast.error("ログアウトに失敗しました");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(email);
      toast.success(
        "パスワードリセット用のメールを送信しました。メールを確認してください。"
      );
      router.push("/auth/verify-email");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "パスワードリセットに失敗しました"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    setIsLoading(true);
    try {
      await authService.updatePassword(newPassword);
      toast.success("パスワードを更新しました");
      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "パスワードの更新に失敗しました"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    isLoading,
  };
};
