import { DEFAULT_AVATAR_URL, DEFAULT_PROJECT } from "@/config";
import { FeedItem, ParticipantsByYear, ProjectType } from "@/types";

// ダミーの役割リスト
const DUMMY_ROLES = [
  "リーダー",
  "イベント企画",
  "地域連携",
  "ボランティア",
  "広報",
  "記録",
  "運営",
];

/**
 * 承認された user_contribution から関係者マップ用のデータを生成する
 * @param currentProject - 現在のプロジェクト
 * @param feedItems - フィードアイテムの配列
 * @returns ParticipantsByYear - 年ごとの関係者データ
 */
export function generateParticipantsFromFeed(
  currentProject: ProjectType | null,
  feedItems: FeedItem[]
): ParticipantsByYear {
  const participantsByYear: ParticipantsByYear = {};

  // フィードアイテムを年ごとにグループ化
  feedItems.forEach((item) => {
    if (!item.user_contributions) return;

    const date = item.date;
    if (date === null || date === undefined) return;
    const year = new Date(date).getFullYear();
    if (!participantsByYear[year]) {
      participantsByYear[year] = [
        {
          id: 0,
          label: currentProject?.name || "プロジェクト名",
          userId: null,
          role: "プロジェクト",
          // #TODO: プロジェクトに thumbnail_url を追加したら、currentProject.thumbnail_url に置き換える
          image: DEFAULT_PROJECT.thumbnail_url,
          frequency: 10,
        },
      ];
    }

    // user_contributionsから参加者データを生成
    item.user_contributions.forEach((contribution, index) => {
      const existingParticipant = participantsByYear[year].find(
        (p) => p.label === contribution.users.name
      );

      if (existingParticipant) {
        // 既存の参加者の場合は頻度を増やす
        existingParticipant.frequency += 1;
      } else {
        // 新規参加者の場合は追加
        participantsByYear[year].push({
          id: participantsByYear[year].length,
          label: contribution.users.name || `参加者${index + 1}`,
          role: DUMMY_ROLES[Math.floor(Math.random() * DUMMY_ROLES.length)],
          userId: contribution.user_id,
          image: contribution.users.thumbnail_url || DEFAULT_AVATAR_URL,
          frequency: 1,
        });
      }
    });
  });

  return participantsByYear;
}
