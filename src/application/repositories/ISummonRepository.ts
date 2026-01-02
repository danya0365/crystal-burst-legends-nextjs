/**
 * ISummonRepository
 * Repository interface for Summon/Gacha data access
 */

import { Character, Rarity } from "./ICharacterRepository";

export type SummonBannerType = "standard" | "featured" | "limited" | "ticket";

export interface SummonBanner {
  id: string;
  name: string;
  description: string;
  type: SummonBannerType;
  featuredCharacters: Character[];
  rateUp: RateUpInfo[];
  costPerSingle: number;
  costPerMulti: number;
  currency: "crystal" | "ticket";
  pityCount: number;
  currentPity: number;
  guaranteedRarity?: Rarity;
  imageUrl?: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface RateUpInfo {
  characterId: string;
  name: string;
  rarity: Rarity;
  rate: number;
}

export interface SummonResult {
  characters: SummonedCharacter[];
  isNew: boolean[];
  pityReached: boolean;
}

export interface SummonedCharacter {
  character: Character;
  isNew: boolean;
  fragmentsGained: number;
}

export interface SummonStats {
  totalSummons: number;
  legendaryPulled: number;
  mythicPulled: number;
  currentTickets: number;
}

export interface ISummonRepository {
  getBanners(): Promise<SummonBanner[]>;
  getBannerById(id: string): Promise<SummonBanner | null>;
  summonSingle(bannerId: string): Promise<SummonResult>;
  summonMulti(bannerId: string): Promise<SummonResult>;
  getStats(): Promise<SummonStats>;
}
