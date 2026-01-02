/**
 * MockPvpRepository
 * Mock implementation for PVP data
 */

import {
    IPvpRepository,
    PvpLeaderboardEntry,
    PvpMatch,
    PvpPlayer,
    PvpRank,
    PvpStats,
} from "@/src/application/repositories/IPvpRepository";

const RANK_NAMES = ["bronze", "silver", "gold", "platinum", "diamond", "legend"] as PvpRank[];

const generatePlayer = (id: string, rank: number): PvpPlayer => {
  const names = ["DarkKnight", "CrystalMaster", "ShadowHunter", "FireLord", "IceQueen", "StormBringer", "DragonSlayer", "NightBlade"];
  const rankIndex = Math.min(Math.floor(rank / 200), 5);
  
  return {
    id,
    name: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 1000),
    level: 30 + Math.floor(Math.random() * 50),
    rank: RANK_NAMES[rankIndex],
    rankPoints: rank,
    power: 8000 + rank * 10 + Math.floor(Math.random() * 2000),
    wins: Math.floor(Math.random() * 100) + 10,
    losses: Math.floor(Math.random() * 50),
    winStreak: Math.floor(Math.random() * 10),
    team: [
      { characterId: "char-001", name: "Crystal Knight", level: 50, power: 4000, element: "light" },
      { characterId: "char-002", name: "Shadow Assassin", level: 45, power: 3500, element: "dark" },
      { characterId: "char-003", name: "Flame Mage", level: 40, power: 3000, element: "fire" },
    ],
  };
};

const MOCK_PLAYER: PvpPlayer = {
  id: "current-player",
  name: "You",
  level: 45,
  rank: "gold",
  rankPoints: 520,
  power: 12500,
  wins: 45,
  losses: 20,
  winStreak: 5,
  team: [
    { characterId: "char-001", name: "Crystal Knight", level: 50, power: 4500, element: "light" },
    { characterId: "char-002", name: "Shadow Assassin", level: 45, power: 4000, element: "dark" },
    { characterId: "char-005", name: "Wind Spirit", level: 40, power: 3500, element: "wind" },
  ],
};

export class MockPvpRepository implements IPvpRepository {
  private player = MOCK_PLAYER;
  private matchHistory: PvpMatch[] = [];

  async getPlayerStats(): Promise<PvpStats> {
    await this.delay(100);
    const rankIndex = RANK_NAMES.indexOf(this.player.rank);
    const pointsToNext = (rankIndex + 1) * 200 - this.player.rankPoints;

    return {
      currentRank: this.player.rank,
      rankPoints: this.player.rankPoints,
      pointsToNextRank: pointsToNext > 0 ? pointsToNext : 0,
      totalWins: this.player.wins,
      totalLosses: this.player.losses,
      winRate: Math.round((this.player.wins / (this.player.wins + this.player.losses)) * 100),
      currentStreak: this.player.winStreak,
      bestStreak: 12,
      seasonRank: 156,
    };
  }

  async findOpponents(): Promise<PvpMatch[]> {
    await this.delay(200);
    const basePoints = this.player.rankPoints;
    
    return Array.from({ length: 3 }, (_, i) => ({
      id: `match-${Date.now()}-${i}`,
      opponent: generatePlayer(`opp-${i}`, basePoints + (Math.random() - 0.5) * 200),
    }));
  }

  async battle(matchId: string): Promise<PvpMatch> {
    await this.delay(500);
    const isWin = Math.random() > 0.4;
    const pointsChange = isWin ? 15 + Math.floor(Math.random() * 10) : -(10 + Math.floor(Math.random() * 5));

    this.player.rankPoints += pointsChange;
    if (isWin) {
      this.player.wins++;
      this.player.winStreak++;
    } else {
      this.player.losses++;
      this.player.winStreak = 0;
    }

    // Update rank
    const newRankIndex = Math.min(Math.floor(this.player.rankPoints / 200), 5);
    this.player.rank = RANK_NAMES[newRankIndex];

    const match: PvpMatch = {
      id: matchId,
      opponent: generatePlayer("opp", this.player.rankPoints),
      result: isWin ? "win" : "lose",
      pointsChange,
      rewards: isWin ? [
        { type: "coin", name: "Coins", amount: 500 },
        { type: "crystal", name: "Crystals", amount: 10 },
      ] : [],
      timestamp: new Date().toISOString(),
    };

    this.matchHistory.unshift(match);
    return match;
  }

  async getLeaderboard(limit = 10): Promise<PvpLeaderboardEntry[]> {
    await this.delay(150);
    const entries: PvpLeaderboardEntry[] = [];

    for (let i = 0; i < limit; i++) {
      const points = 1200 - i * 50 + Math.floor(Math.random() * 30);
      entries.push({
        rank: i + 1,
        player: generatePlayer(`leader-${i}`, points),
        isCurrentPlayer: i === 7,
      });
    }

    return entries;
  }

  async getMatchHistory(limit = 10): Promise<PvpMatch[]> {
    await this.delay(100);
    return this.matchHistory.slice(0, limit);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockPvpRepository = new MockPvpRepository();
