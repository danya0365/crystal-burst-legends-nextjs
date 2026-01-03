/**
 * MockGachaRepository
 * Mock implementation for Gacha/Summon system
 */

import { Character, Rarity } from "@/src/application/repositories/ICharacterRepository";
import {
    GachaBanner,
    GachaPullResult,
    GachaRates,
    IGachaRepository,
    PityInfo,
} from "@/src/application/repositories/IGachaRepository";

// All available characters for gacha
const GACHA_POOL: Character[] = [
  // Common (60%)
  {
    id: "gc1", name: "Novice Knight", description: "A young warrior starting their journey",
    rarity: "common", element: "fire", characterClass: "warrior",
    level: 1, maxLevel: 40, stars: 1, maxStars: 3, power: 100,
    hp: 500, attack: 50, defense: 30, speed: 10,
    skills: [], isOwned: false, fragments: 0, fragmentsRequired: 10,
    createdAt: "", updatedAt: ""
  },
  {
    id: "gc2", name: "Forest Archer", description: "Swift archer from the woodlands",
    rarity: "common", element: "wind", characterClass: "assassin",
    level: 1, maxLevel: 40, stars: 1, maxStars: 3, power: 95,
    hp: 400, attack: 60, defense: 20, speed: 15,
    skills: [], isOwned: false, fragments: 0, fragmentsRequired: 10,
    createdAt: "", updatedAt: ""
  },
  {
    id: "gc3", name: "Village Healer", description: "Gentle healer with nature magic",
    rarity: "common", element: "light", characterClass: "support",
    level: 1, maxLevel: 40, stars: 1, maxStars: 3, power: 90,
    hp: 450, attack: 30, defense: 25, speed: 12,
    skills: [], isOwned: false, fragments: 0, fragmentsRequired: 10,
    createdAt: "", updatedAt: ""
  },
  
  // Uncommon (25%)
  {
    id: "gu1", name: "Storm Mage", description: "Master of thunder magic",
    rarity: "uncommon", element: "wind", characterClass: "mage",
    level: 1, maxLevel: 50, stars: 1, maxStars: 4, power: 200,
    hp: 500, attack: 80, defense: 25, speed: 14,
    skills: [], isOwned: false, fragments: 0, fragmentsRequired: 20,
    createdAt: "", updatedAt: ""
  },
  {
    id: "gu2", name: "Iron Guardian", description: "Stalwart defender of the realm",
    rarity: "uncommon", element: "earth", characterClass: "tank",
    level: 1, maxLevel: 50, stars: 1, maxStars: 4, power: 210,
    hp: 800, attack: 40, defense: 60, speed: 8,
    skills: [], isOwned: false, fragments: 0, fragmentsRequired: 20,
    createdAt: "", updatedAt: ""
  },
  
  // Rare (10%)
  {
    id: "gr1", name: "Blade Dancer", description: "Deadly dancer with twin blades",
    rarity: "rare", element: "wind", characterClass: "assassin",
    level: 1, maxLevel: 60, stars: 1, maxStars: 5, power: 400,
    hp: 550, attack: 100, defense: 30, speed: 25,
    skills: [], isOwned: false, fragments: 0, fragmentsRequired: 40,
    createdAt: "", updatedAt: ""
  },
  {
    id: "gr2", name: "Frost Witch", description: "Ice sorceress of the frozen north",
    rarity: "rare", element: "water", characterClass: "mage",
    level: 1, maxLevel: 60, stars: 1, maxStars: 5, power: 420,
    hp: 500, attack: 110, defense: 28, speed: 18,
    skills: [], isOwned: false, fragments: 0, fragmentsRequired: 40,
    createdAt: "", updatedAt: ""
  },
  
  // Epic (4%)
  {
    id: "ge1", name: "Shadow Reaper", description: "Deadly assassin from the shadows",
    rarity: "epic", element: "dark", characterClass: "assassin",
    level: 1, maxLevel: 80, stars: 1, maxStars: 6, power: 800,
    hp: 700, attack: 150, defense: 40, speed: 30,
    skills: [], isOwned: false, fragments: 0, fragmentsRequired: 80,
    createdAt: "", updatedAt: ""
  },
  {
    id: "ge2", name: "Phoenix Knight", description: "Immortal warrior of the flame",
    rarity: "epic", element: "fire", characterClass: "warrior",
    level: 1, maxLevel: 80, stars: 1, maxStars: 6, power: 850,
    hp: 900, attack: 130, defense: 60, speed: 20,
    skills: [], isOwned: false, fragments: 0, fragmentsRequired: 80,
    createdAt: "", updatedAt: ""
  },
  
  // Legendary (0.8%)
  {
    id: "gl1", name: "Dragon Emperor", description: "Ancient dragon in human form",
    rarity: "legendary", element: "fire", characterClass: "warrior",
    level: 1, maxLevel: 100, stars: 1, maxStars: 7, power: 1500,
    hp: 1200, attack: 200, defense: 80, speed: 25,
    skills: [], isOwned: false, fragments: 0, fragmentsRequired: 150,
    createdAt: "", updatedAt: ""
  },
  {
    id: "gl2", name: "Celestial Sage", description: "Keeper of divine knowledge",
    rarity: "legendary", element: "light", characterClass: "mage",
    level: 1, maxLevel: 100, stars: 1, maxStars: 7, power: 1450,
    hp: 1000, attack: 250, defense: 60, speed: 22,
    skills: [], isOwned: false, fragments: 0, fragmentsRequired: 150,
    createdAt: "", updatedAt: ""
  },
  
  // Mythic (0.2%)
  {
    id: "gm1", name: "Void Overlord", description: "Master of the void dimension",
    rarity: "mythic", element: "dark", characterClass: "mage",
    level: 1, maxLevel: 120, stars: 1, maxStars: 7, power: 3000,
    hp: 1500, attack: 350, defense: 100, speed: 35,
    skills: [], isOwned: false, fragments: 0, fragmentsRequired: 300,
    createdAt: "", updatedAt: ""
  },
];

const BANNERS: GachaBanner[] = [
  {
    id: "standard",
    name: "Standard Banner",
    description: "All characters available",
    featuredCharacterIds: [],
    rateUpMultiplier: 1,
    startDate: "2024-01-01",
    endDate: "2099-12-31",
    isActive: true,
  },
  {
    id: "void-event",
    name: "🔥 Void Overlord Rate Up!",
    description: "Limited! Increased rate for Void Overlord!",
    featuredCharacterIds: ["gm1"],
    rateUpMultiplier: 5,
    startDate: "2024-01-01",
    endDate: "2026-02-01",
    isActive: true,
  },
];

const RATES: GachaRates = {
  common: 0.60,
  uncommon: 0.25,
  rare: 0.10,
  epic: 0.04,
  legendary: 0.008,
  mythic: 0.002,
};

const SINGLE_COST = 100;
const MULTI_COST = 900;
const MULTI_COUNT = 10;

export class MockGachaRepository implements IGachaRepository {
  private pity = 0;
  private unlockedCharacterIds: Set<string> = new Set();
  private crystals = 5000;

  async getActiveBanners(): Promise<GachaBanner[]> {
    await this.delay(50);
    return BANNERS.filter((b) => b.isActive);
  }

  async getBannerById(id: string): Promise<GachaBanner | null> {
    await this.delay(50);
    return BANNERS.find((b) => b.id === id) || null;
  }

  async getRates(): Promise<GachaRates> {
    await this.delay(50);
    return { ...RATES };
  }

  async getPityInfo(): Promise<PityInfo> {
    await this.delay(50);
    return {
      currentPity: this.pity,
      softPityStart: 70,
      hardPity: 90,
      guaranteedRarity: "legendary",
    };
  }

  async getCrystals(): Promise<number> {
    return this.crystals;
  }

  async pullSingle(bannerId: string): Promise<GachaPullResult> {
    await this.delay(200);
    
    if (this.crystals < SINGLE_COST) {
      throw new Error("Not enough crystals");
    }
    
    this.crystals -= SINGLE_COST;
    this.pity++;
    
    const character = this.rollCharacter(bannerId);
    const isNew = !this.unlockedCharacterIds.has(character.id);
    
    if (isNew) {
      this.unlockedCharacterIds.add(character.id);
    }
    
    if (character.rarity === "legendary" || character.rarity === "mythic") {
      this.pity = 0;
    }
    
    return {
      character: { ...character, isOwned: true },
      isNew,
      shardsEarned: isNew ? 0 : this.getShardsForRarity(character.rarity),
    };
  }

  async pullMulti(bannerId: string, count: number = MULTI_COUNT): Promise<GachaPullResult[]> {
    await this.delay(300);
    
    if (this.crystals < MULTI_COST) {
      throw new Error("Not enough crystals");
    }
    
    this.crystals -= MULTI_COST;
    
    const results: GachaPullResult[] = [];
    for (let i = 0; i < count; i++) {
      this.pity++;
      const character = this.rollCharacter(bannerId);
      const isNew = !this.unlockedCharacterIds.has(character.id);
      
      if (isNew) {
        this.unlockedCharacterIds.add(character.id);
      }
      
      if (character.rarity === "legendary" || character.rarity === "mythic") {
        this.pity = 0;
      }
      
      results.push({
        character: { ...character, isOwned: true },
        isNew,
        shardsEarned: isNew ? 0 : this.getShardsForRarity(character.rarity),
      });
    }
    
    return results;
  }

  async getPullCost(type: "single" | "multi"): Promise<{ crystals: number; discount?: number }> {
    if (type === "single") {
      return { crystals: SINGLE_COST };
    }
    return { crystals: MULTI_COST, discount: 10 };
  }

  async canAffordPull(type: "single" | "multi"): Promise<boolean> {
    const cost = type === "single" ? SINGLE_COST : MULTI_COST;
    return this.crystals >= cost;
  }

  private rollCharacter(bannerId: string): Character {
    const banner = BANNERS.find((b) => b.id === bannerId);
    
    // Hard pity guarantee
    if (this.pity >= 90) {
      const legendaries = GACHA_POOL.filter((c) => c.rarity === "legendary");
      return legendaries[Math.floor(Math.random() * legendaries.length)];
    }
    
    // Soft pity (increases legendary rate after 70 pulls)
    let adjustedRates = { ...RATES };
    if (this.pity >= 70) {
      const pityBonus = (this.pity - 70) * 0.05;
      adjustedRates.legendary += pityBonus;
      adjustedRates.common -= pityBonus;
    }
    
    // Roll for rarity
    const roll = Math.random();
    let cumulative = 0;
    let selectedRarity: Rarity = "common";
    
    const rarityOrder: Rarity[] = ["mythic", "legendary", "epic", "rare", "uncommon", "common"];
    for (const rarity of rarityOrder) {
      cumulative += adjustedRates[rarity];
      if (roll <= cumulative) {
        selectedRarity = rarity;
        break;
      }
    }
    
    // Get characters of selected rarity
    let pool = GACHA_POOL.filter((c) => c.rarity === selectedRarity);
    
    // Rate up featured
    if (banner && banner.featuredCharacterIds.length > 0) {
      const featured = pool.filter((c) => banner.featuredCharacterIds.includes(c.id));
      if (featured.length > 0 && Math.random() < 0.5) {
        pool = featured;
      }
    }
    
    return pool[Math.floor(Math.random() * pool.length)] || GACHA_POOL[0];
  }

  private getShardsForRarity(rarity: Rarity): number {
    const shardMap: Record<Rarity, number> = {
      common: 5, uncommon: 10, rare: 25, epic: 50, legendary: 100, mythic: 200
    };
    return shardMap[rarity] || 5;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockGachaRepository = new MockGachaRepository();
