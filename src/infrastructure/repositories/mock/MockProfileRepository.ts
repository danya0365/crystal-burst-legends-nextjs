import {
    IProfileRepository,
    PlayerProfile,
    PlayerStats,
} from "@/src/application/repositories/IProfileRepository";

const MOCK_PROFILE: PlayerProfile = {
  id: "player_001",
  name: "CrystalMaster",
  level: 42,
  exp: 85000,
  expToNextLevel: 100000,
  vipLevel: 3,
  avatar: "🎮",
  title: "Dragon Slayer",
  power: 125000,
  joinedAt: "2025-06-15T00:00:00Z",
  guildName: "Crystal Knights",
};

const MOCK_STATS: PlayerStats = {
  totalBattles: 1250,
  wins: 892,
  losses: 358,
  winRate: 71.36,
  highestDamage: 2500000,
  charactersOwned: 18,
  totalPower: 125000,
  stagesCleared: 156,
  achievementsCompleted: 45,
};

export class MockProfileRepository implements IProfileRepository {
  private profile = { ...MOCK_PROFILE };

  async getProfile(): Promise<PlayerProfile> {
    await this.delay(100);
    return { ...this.profile };
  }

  async getStats(): Promise<PlayerStats> {
    await this.delay(100);
    return { ...MOCK_STATS };
  }

  async updateName(name: string): Promise<PlayerProfile> {
    await this.delay(150);
    this.profile = { ...this.profile, name };
    return { ...this.profile };
  }

  async updateAvatar(avatar: string): Promise<PlayerProfile> {
    await this.delay(150);
    this.profile = { ...this.profile, avatar };
    return { ...this.profile };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
