export type ProfileStatsResponse = {
  points: number;
  badges: {
    count: number;
    list: string[];
  };
  activities: {
    count: number;
    list: string[];
  };
};

export const mockProfileStats: ProfileStatsResponse = {
  points: 1500,
  badges: {
    count: 3,
    list: ["廃材リサイクル", "緑化リーダー", "コミュニティ貢献"],
  },
  activities: {
    count: 0,
    list: [],
  },
};
