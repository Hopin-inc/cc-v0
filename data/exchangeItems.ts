export type ExchangeItem = {
  id: string;
  name: string;
  description: string;
  points: number;
  image: string;
};

export const exchangeItems: ExchangeItem[] = [
  {
    id: "1",
    name: "地域カフェでのコーヒー1杯無料券",
    description:
      "地元で人気の「まちカフェ」でお好きなコーヒー1杯と交換できます",
    points: 50,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
  {
    id: "2",
    name: "コワーキングスペース3時間無料券",
    description:
      "地域のコワーキングスペース「みんなの仕事場」で3時間無料で利用できます",
    points: 100,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2301&q=80",
  },
  {
    id: "3",
    name: "地元農家の規格外野菜セット（1kg）",
    description:
      "地元農家さんの採れたて新鮮野菜の詰め合わせです。形は不揃いでもおいしさは抜群！",
    points: 150,
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
  {
    id: "4",
    name: "地域の伝統工芸品ミニ体験チケット",
    description:
      "地元の職人さんから伝統工芸を学べる45分間のミニ体験チケットです",
    points: 200,
    image:
      "https://images.unsplash.com/photo-1459908676235-d5f02a50184b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
  {
    id: "5",
    name: "地域の歴史ガイドツアー参加券",
    description:
      "地域の歴史に詳しいガイドと一緒に、まちの隠れた魅力を探検できます",
    points: 250,
    image:
      "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
  },
];
