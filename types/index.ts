// Feed types

import { Tables } from "./supabase";

export type ProjectType = Tables<"projects"> & {
  slug: string;
};

export type ContributionType = Tables<"contribution_types">;

export type ActivityType = Tables<"activities"> & {
  badges: Badge[];
};

export type ProjectPrizeItem = Tables<"project_prize_items">;

export type Badge = Tables<"badges">;

export type User = Tables<"users">;
export type UserPhoto = Tables<"user_photos">;

export type ContributionStatus = "claimed" | "approved" | "rejected";

export type UserContribution = Tables<"user_contributions"> & {
  users: User;
  user_photos: UserPhoto[];
  status: ContributionStatus;
};

export type UserProfile = User & {
  badges: Badge[];
  projects: ProjectType[];
};

export type Comment = Tables<"user_activity_comments"> & {
  users: User;
};

export type UserPointTransaction = Tables<"user_point_transactions">;

export type ActivityBadge = {
  badge_id: string;
  badges: Badge;
};

export type FeedItem = ActivityType & {
  user_contributions: Array<
    UserContribution & {
      user_photos: UserPhoto[];
      users: User;
    }
  >;
  created_by?: User;
  comments: Comment[];
  activity_badges: ActivityBadge[];
};

export type NotificationType =
  | "contribution_approved"
  | "contribution_rejected"
  | "points_earned";

export type Notification = Omit<Tables<"notifications">, "type"> & {
  type: NotificationType;
};

// Participant types
export type Participant = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
};

export type ParticipantsByYear = Record<
  number,
  {
    id: number;
    label: string;
    role: string;
    userId: string | null;
    image: string;
    frequency: number;
  }[]
>;

export type RoleColors = {
  [key: string]: string;
};

// Timeline types
export type TimelineParticipant = {
  name: string;
  userId: string;
  thumbnailUrl?: string;
};

export type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  images: string[];
  participants: TimelineParticipant[];
  location?: string;
  icon?: string;
};

// Activity types
export type Activity = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  participants: Participant[];
  createdAt: string;
  updatedAt: string;
};
