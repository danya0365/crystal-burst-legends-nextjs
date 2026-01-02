/**
 * IMissionRepository
 * Repository interface for Missions data access
 */

export type MissionType = "daily" | "weekly" | "achievement" | "event";
export type MissionStatus = "locked" | "available" | "completed" | "claimed";

export interface Mission {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  status: MissionStatus;
  progress: number;
  target: number;
  rewards: MissionReward[];
  expiresAt?: string;
}

export interface MissionReward {
  type: "crystal" | "coin" | "fragment" | "item" | "exp";
  name: string;
  amount: number;
}

export interface MissionStats {
  dailyCompleted: number;
  dailyTotal: number;
  weeklyCompleted: number;
  weeklyTotal: number;
  refreshIn: number;
}

export interface IMissionRepository {
  getAll(): Promise<Mission[]>;
  getByType(type: MissionType): Promise<Mission[]>;
  claim(id: string): Promise<Mission>;
  getStats(): Promise<MissionStats>;
}
