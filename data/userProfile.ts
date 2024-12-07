import { UserProfile } from "@/types";

export const userProfile: UserProfile = {
  id: "3d503e9f-110c-487f-8b44-64715f003c2b",
  name: "山田 美咲",
  role: "member",
  thumbnail_url:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fotor%20AI%20Image%20Creator%20Nov%2030%20(2).jpg-X3ovmV9GulL1hlyeo9MZSDkYcJkm07.jpeg",
  bio: "神戸でIT会社に勤めつつ、週末は地元の人々と交流しながら、一緒に手を動かすことを楽しんでいます。",
  badges: [
    {
      id: "1",
      name: "ムードメーカー",
      value: "test-badge",
      created_at: "2023-05-20",
    },
    {
      id: "2",
      name: "解体プロ",
      value: "pro-recycler",
      created_at: "2023-05-20",
    },
    {
      id: "3",
      name: "DIY",
      value: "diy",
      created_at: "2023-05-20",
    },
  ],
  total_points: 1500,
  available_points: 500,
  created_at: "2023-05-20",
};
