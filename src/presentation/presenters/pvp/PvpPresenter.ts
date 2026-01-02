import { IPvpRepository, PvpLeaderboardEntry, PvpMatch, PvpStats } from "@/src/application/repositories/IPvpRepository";
import { Metadata } from "next";

export interface PvpViewModel {
  stats: PvpStats;
  opponents: PvpMatch[];
  leaderboard: PvpLeaderboardEntry[];
  matchHistory: PvpMatch[];
}

export class PvpPresenter {
  constructor(private readonly repository: IPvpRepository) {}

  async getViewModel(): Promise<PvpViewModel> {
    const [stats, opponents, leaderboard, matchHistory] = await Promise.all([
      this.repository.getPlayerStats(),
      this.repository.findOpponents(),
      this.repository.getLeaderboard(10),
      this.repository.getMatchHistory(5),
    ]);
    return { stats, opponents, leaderboard, matchHistory };
  }

  generateMetadata(): Metadata {
    return { title: "PVP Arena | Crystal Burst Legends", description: "Battle other players in Crystal Burst Legends" };
  }

  async findOpponents(): Promise<PvpMatch[]> {
    return this.repository.findOpponents();
  }

  async battle(matchId: string): Promise<PvpMatch> {
    return this.repository.battle(matchId);
  }

  async getLeaderboard(): Promise<PvpLeaderboardEntry[]> {
    return this.repository.getLeaderboard(10);
  }
}
