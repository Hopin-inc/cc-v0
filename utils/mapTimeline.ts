import { FeedItem, Participant, TimelineEvent } from "@/types";

/**
 * フィードデータから活動年表のデータを生成する
 * @param feedItems - フィードアイテムの配列
 * @returns TimelineEvent[] - 活動年表のデータ
 */
export function generateTimelineFromFeed(
  feedItems: FeedItem[]
): TimelineEvent[] {
  return feedItems
    .filter(
      (item) => item.user_contributions && item.user_contributions.length > 0
    )
    .map((item) => {
      const images = item.user_contributions.flatMap((contribution) =>
        contribution.user_photos.map((photo) => photo.url)
      );
      const participants = Array.from(
        new Map(
          item.user_contributions.map((contribution) => [
            contribution.user_id,
            {
              name: contribution.users.name || "名前未設定",
              userId: contribution.user_id,
              thumbnailUrl: contribution.users.thumbnail_url || "",
            },
          ])
        ).values()
      );
      const timelineItem: TimelineEvent = {
        id: item.id,
        date: item.date || new Date().toISOString(),
        title: item.title || "タイトル未設定",
        description: item.content || "説明なし",
        images,
        participants,
        location: item.location || undefined,
        icon: item.icon || undefined,
      };
      return timelineItem;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // 日付の降順でソート
}
