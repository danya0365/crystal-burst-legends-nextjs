/**
 * IPvpRepository
 * Repository interface for PVP/Battle data access
 */

export type PvpRank = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "legend";
export type MatchResult = "win" | "lose" | "draw";

export interface PvpPlayer {
  id: string;
  name: string;
  level: number;
  rank: PvpRank;
  rankPoints: number;
  power: number;
  wins: number;
  losses: number;
  winStreak: number;
  team: PvpTeamMember[];
  imageUrl?: string;
}

export interface PvpTeamMember {
  characterId: string;
  name: string;
  level: number;
  power: number;
  element: string;
}

export interface PvpMatch {
  id: string;
  opponent: PvpPlayer;
  result?: MatchResult;
  pointsChange?: number;
  rewards?: PvpReward[];
  timestamp?: string;
}

export interface PvpReward {
  type: "crystal" | "coin" | "ticket" | "item";
  name: string;
  amount: number;
}

export interface PvpStats {
  currentRank: PvpRank;
  rankPoints: number;
  pointsToNextRank: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  seasonRank: number;
}

export interface PvpLeaderboardEntry {
  rank: number;
  player: PvpPlayer;
  isCurrentPlayer: boolean;
}

export interface IPvpRepository {
  getPlayerStats(): Promise<PvpStats>;
  findOpponents(): Promise<PvpMatch[]>;
  battle(matchId: string): Promise<PvpMatch>;
  getLeaderboard(limit?: number): Promise<PvpLeaderboardEntry[]>;
  getMatchHistory(limit?: number): Promise<PvpMatch[]>;
}
