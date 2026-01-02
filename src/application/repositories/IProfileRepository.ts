/**
 * IProfileRepository
 * Repository interface for Player Profile data access
 */

export interface PlayerProfile {
  id: string;
  name: string;
  level: number;
  exp: number;
  expToNextLevel: number;
  vipLevel: number;
  avatar: string;
  title: string;
  power: number;
  joinedAt: string;
  guildName?: string;
}

export interface PlayerStats {
  totalBattles: number;
  wins: number;
  losses: number;
  winRate: number;
  highestDamage: number;
  charactersOwned: number;
  totalPower: number;
  stagesCleared: number;
  achievementsCompleted: number;
}

export interface IProfileRepository {
  getProfile(): Promise<PlayerProfile>;
  getStats(): Promise<PlayerStats>;
  updateName(name: string): Promise<PlayerProfile>;
  updateAvatar(avatar: string): Promise<PlayerProfile>;
}
