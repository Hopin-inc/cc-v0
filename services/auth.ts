import { createSupabaseClient } from "./base";
import { AuthError } from "@supabase/supabase-js";

const formatAuthError = (error: AuthError): string => {
  switch (error.message) {
    case "User already registered":
      return "このメールアドレスは既に登録されています";
    case "Invalid login credentials":
      return "メールアドレスまたはパスワードが正しくありません";
    case "Email not confirmed":
      return "メールアドレスが確認できていません";
    case "Password is too short":
      return "パスワードは6文字以上で入力してください";
    default:
      return error.message;
  }
};

export const authService = {
  signUp: async (email: string, password: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw new Error(formatAuthError(error));
    return data;
  },

  signIn: async (email: string, password: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(formatAuthError(error));
    return data;
  },

  signOut: async () => {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getSession: async () => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data;
  },

  resetPassword: async (email: string) => {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw new Error(formatAuthError(error));
  },

  updatePassword: async (newPassword: string) => {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw new Error(formatAuthError(error));
  },
};
