export type Notification = {
  id: string;
  title: string;
  description: string;
  date: string;
  isRead: boolean;
  type: "contribution" | "announcement" | "badge";
};

export const notifications: Notification[] = [
  {
    id: "1",
    title: "",
    description: "「解体屋さんから廃材を回収する会」の活動が承認されました",
    date: "",
    isRead: false,
    type: "contribution",
  },
  {
    id: "2",
    title: "",
    description: "佐藤恵子さんが旧山田邸の解体作業についてブログを投稿しました",
    date: "",
    isRead: false,
    type: "announcement",
  },
  {
    id: "3",
    title: "",
    description: "田中誠一さんが「DIYワークショップ」の参加者を募集しています",
    date: "",
    isRead: false,
    type: "contribution",
  },
  {
    id: "4",
    title: "",
    description: "「空き家庭園の緑化活動」にコメントが追加されました",
    date: "",
    isRead: false,
    type: "announcement",
  },
  {
    id: "5",
    title: "",
    description: "あなたの投稿した写真が5件のいいねを獲得しました",
    date: "",
    isRead: false,
    type: "badge",
  },
];
