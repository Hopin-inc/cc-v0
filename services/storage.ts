import { v4 as uuidv4 } from "uuid";
import { createSupabaseClient } from "./base";

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
] as const;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export type UploadedPhoto = {
  id: string;
  url: string;
};

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileValidationError";
  }
}

export const storageService = {
  validateFile: (file: File): void => {
    if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
      throw new FileValidationError(
        "ファイル形式はJPG、JPEG、PNGのみ対応しています"
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new FileValidationError("ファイルサイズは10MB以下にしてください");
    }
  },

  uploadPhoto: async (file: File, userId: string): Promise<string> => {
    const supabase = createSupabaseClient();
    const fileExt = file.type.split("/")[1];
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("user_photos")
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error("Failed to upload photo to storage");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("user_photos").getPublicUrl(filePath);

    return publicUrl;
  },

  uploadThumbnail: async (file: File, userId: string): Promise<string> => {
    const supabase = createSupabaseClient();
    const fileExt = file.type.split("/")[1];
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("user_thumbnails")
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error("Failed to upload thumbnail to storage");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("user_thumbnails").getPublicUrl(filePath);

    return publicUrl;
  },
};
