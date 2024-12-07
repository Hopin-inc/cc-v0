import { FeedItem } from "@/types";

export const activities: FeedItem[] = [
  {
    id: "1",
    title: "解体屋さんから廃材を回収する会",
    content: "解体屋さんから廃材を回収する会",
    date: "2023-05-20",
    location: "旧山田邸",
    project_id: "1",
    type: "contribution",
    created_at: "2023-05-20T00:00:00.000Z",
    user_contributions: [
      {
        id: "1",
        user_id: "1",
        project_id: "1",
        activity_id: "1",
        type_id: "1",
        status: "approved",
        date: "2023-05-20",
        created_at: "2023-05-20T00:00:00.000Z",
        users: {
          id: "1",
          name: "山田美咲",
          thumbnail_url:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fotor%20AI%20Image%20Creator%20Nov%2030%20(2).jpg-X3ovmV9GulL1hlyeo9MZSDkYcJkm07.jpeg",
          role: "member",
          bio: null,
          available_points: 0,
          total_points: 0,
          created_at: "2023-05-20T00:00:00.000Z",
        },
        user_photos: [
          {
            id: "1",
            url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_4881%201-Cu1dUrGu08r74nHpbT7zWpxqEww6lm.png",
            user_id: "1",
            project_id: "1",
            user_contibution_id: "1",
            created_at: "2023-05-20T00:00:00.000Z",
          },
        ],
      },
      {
        id: "2",
        user_id: "2",
        project_id: "1",
        activity_id: "1",
        type_id: "1",
        status: "approved",
        date: "2023-05-20",
        created_at: "2023-05-20T00:00:00.000Z",
        users: {
          id: "2",
          name: "佐藤恵子",
          thumbnail_url:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fotor%20AI%20Image%20Creator%20Nov%2030%20(1).jpg-crFDG8KnXQumBbkFlMTwwzyjtvd7jg.jpeg",
          role: "member",
          bio: null,
          available_points: 0,
          total_points: 0,
          created_at: "2023-05-20T00:00:00.000Z",
        },
        user_photos: [
          {
            id: "2",
            url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_4970%201-L4iu7eJuAA8Nl0k3EJdUSQjAWqKRcb.png",
            user_id: "2",
            project_id: "1",
            user_contibution_id: "2",
            created_at: "2023-05-20T00:00:00.000Z",
          },
        ],
      },
    ],
  },
];
