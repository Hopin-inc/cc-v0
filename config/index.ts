// 環境変数
export const ENV = process.env.NODE_ENV || "development";
export const IS_PROD = ENV === "production";
export const IS_DEV = ENV === "development";

export const DEFAULT_PROJECT_NAME = "アルケDAO";
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

// その他の設定
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
