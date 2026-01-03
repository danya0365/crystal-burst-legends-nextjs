/**
 * IGachaRepository
 * Repository interface for Gacha/Summon system
 */

import { Character, Rarity } from "./ICharacterRepository";

export interface GachaBanner {
  id: string;
  name: string;
  description: string;
  featuredCharacterIds: string[];
  rateUpMultiplier: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface GachaPullResult {
  character: Character;
  isNew: boolean;
  shardsEarned: number;
}

export interface GachaRates {
  common: number;
  uncommon: number;
  rare: number;
  epic: number;
  legendary: number;
  mythic: number;
}

export interface PityInfo {
  currentPity: number;
  softPityStart: number;
  hardPity: number;
  guaranteedRarity: Rarity;
}

export interface IGachaRepository {
  /**
   * Get all active banners
   */
  getActiveBanners(): Promise<GachaBanner[]>;

  /**
   * Get banner by ID
   */
  getBannerById(id: string): Promise<GachaBanner | null>;

  /**
   * Get current gacha rates
   */
  getRates(): Promise<GachaRates>;

  /**
   * Get pity information
   */
  getPityInfo(): Promise<PityInfo>;

  /**
   * Perform a single pull
   */
  pullSingle(bannerId: string): Promise<GachaPullResult>;

  /**
   * Perform 10x pull
   */
  pullMulti(bannerId: string, count?: number): Promise<GachaPullResult[]>;

  /**
   * Get pull cost
   */
  getPullCost(type: "single" | "multi"): Promise<{ crystals: number; discount?: number }>;

  /**
   * Check if player can afford pull
   */
  canAffordPull(type: "single" | "multi"): Promise<boolean>;

  /**
   * Get current crystals
   */
  getCrystals(): Promise<number>;
}
