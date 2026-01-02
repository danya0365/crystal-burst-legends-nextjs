/**
 * IAchievementRepository
 * Repository interface for Achievements data access
 */

export type AchievementCategory = "combat" | "collection" | "progression" | "social" | "special";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  reward: AchievementReward;
  completedAt?: string;
}

export interface AchievementReward {
  type: "crystal" | "coin" | "title" | "avatar";
  name: string;
  amount: number;
}

export interface AchievementStats {
  total: number;
  completed: number;
  points: number;
}

export interface IAchievementRepository {
  getAll(): Promise<Achievement[]>;
  getByCategory(category: AchievementCategory): Promise<Achievement[]>;
  claim(id: string): Promise<Achievement>;
  getStats(): Promise<AchievementStats>;
}
