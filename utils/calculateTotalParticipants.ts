import { FeedItem } from "@/types";

/**
 * フィードデータから総動員数を計算する
 * @param feedItems - フィードアイテムの配列
 * @returns number - ユニークな参加者数
 */
export function calculateTotalParticipants(feedItems: FeedItem[]): number {
  const uniqueUserIds = new Set<string>();

  feedItems.forEach((item) => {
    item.user_contributions?.forEach((contribution) => {
      if (contribution.user_id) {
        uniqueUserIds.add(contribution.user_id);
      }
    });
  });

  return uniqueUserIds.size;
}
