// 環境変数
export const ENV = process.env.NODE_ENV || "development";
export const IS_PROD = ENV === "production";
export const IS_DEV = ENV === "development";

export const DEFAULT_PROJECT = {
  name: "アルケDAO",
  thumbnail_url:
    "https://archedao.my.canva.site/media/195ac5ba3f853027fa691e73776a3f11.png",
  description:
    "暮らしやまちの共感を集めて、共助のパワーにするDAO「アルケDAO」です。",
  links: [
    {
      service: "twitter",
      url: "https://x.com/archedao_pr",
    },
    {
      service: "instagram",
      url: "https://www.instagram.com/archedao_pr/",
    },
    {
      service: "blog",
      url: "https://note.com/archedao_pr",
    },
    {
      service: "homepage",
      url: "https://archedao.my.canva.site/",
    },
  ],
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const DEFAULT_AVATAR_URL =
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2015%2F10%2F05%2F22%2F37%2Fblank-profile-picture-973460_960_720.png&f=1&nofb=1&ipt=d0ae5041395b5f62d4f3e0306fa4854d4f5496b0c2b70a593c8f4499af4a1646&ipo=images";
// その他の設定
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
