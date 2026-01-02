/**
 * MockSummonRepository
 * Mock implementation for Summon/Gacha data
 */

import { Character, Rarity } from "@/src/application/repositories/ICharacterRepository";
import {
    ISummonRepository,
    SummonBanner,
    SummonResult,
    SummonStats,
    SummonedCharacter,
} from "@/src/application/repositories/ISummonRepository";

const RARITY_RATES: Record<Rarity, number> = {
  common: 0.40,
  uncommon: 0.30,
  rare: 0.20,
  epic: 0.07,
  legendary: 0.025,
  mythic: 0.005,
};

const generateCharacter = (rarity: Rarity): Character => {
  const names: Record<Rarity, string[]> = {
    common: ["Novice Warrior", "Apprentice Mage", "Scout"],
    uncommon: ["Skilled Fighter", "Fire Adept", "Shadow Scout"],
    rare: ["Flame Mage", "Ice Knight", "Storm Archer"],
    epic: ["Shadow Assassin", "Wind Spirit", "Thunder Lord"],
    legendary: ["Crystal Knight", "Ocean Guardian", "Dragon Sage"],
    mythic: ["Phoenix Lord", "Void Emperor", "Celestial Queen"],
  };

  const name = names[rarity][Math.floor(Math.random() * names[rarity].length)];
  const elements = ["fire", "water", "earth", "wind", "light", "dark"] as const;
  const classes = ["warrior", "mage", "assassin", "tank", "support"] as const;

  return {
    id: `char-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description: `A ${rarity} ${name}`,
    rarity,
    element: elements[Math.floor(Math.random() * elements.length)],
    characterClass: classes[Math.floor(Math.random() * classes.length)],
    level: 1,
    maxLevel: rarity === "mythic" ? 120 : rarity === "legendary" ? 100 : rarity === "epic" ? 80 : 60,
    stars: rarity === "mythic" ? 6 : rarity === "legendary" ? 5 : rarity === "epic" ? 4 : 3,
    maxStars: 7,
    power: rarity === "mythic" ? 5000 : rarity === "legendary" ? 3000 : rarity === "epic" ? 2000 : 1000,
    hp: 1000 + Math.floor(Math.random() * 500),
    attack: 100 + Math.floor(Math.random() * 50),
    defense: 50 + Math.floor(Math.random() * 30),
    speed: 80 + Math.floor(Math.random() * 40),
    skills: [],
    isOwned: true,
    fragments: 0,
    fragmentsRequired: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const rollRarity = (pityCount: number): Rarity => {
  // Pity system: guaranteed legendary at 90 pulls
  if (pityCount >= 89) return "legendary";
  
  const roll = Math.random();
  let cumulative = 0;
  
  for (const [rarity, rate] of Object.entries(RARITY_RATES)) {
    cumulative += rate;
    if (roll < cumulative) return rarity as Rarity;
  }
  
  return "common";
};

const MOCK_BANNERS: SummonBanner[] = [
  {
    id: "standard-banner",
    name: "Standard Summon",
    description: "The standard summon pool with all available characters",
    type: "standard",
    featuredCharacters: [],
    rateUp: [],
    costPerSingle: 100,
    costPerMulti: 900,
    currency: "crystal",
    pityCount: 90,
    currentPity: 0,
    isActive: true,
  },
  {
    id: "featured-phoenix",
    name: "Phoenix Lord Rate Up",
    description: "Increased chance to summon the mythic Phoenix Lord!",
    type: "featured",
    featuredCharacters: [],
    rateUp: [
      { characterId: "char-007", name: "Phoenix Lord", rarity: "mythic", rate: 0.5 },
    ],
    costPerSingle: 100,
    costPerMulti: 900,
    currency: "crystal",
    pityCount: 90,
    currentPity: 45,
    guaranteedRarity: "legendary",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "ticket-banner",
    name: "Ticket Summon",
    description: "Use your summon tickets here",
    type: "ticket",
    featuredCharacters: [],
    rateUp: [],
    costPerSingle: 1,
    costPerMulti: 10,
    currency: "ticket",
    pityCount: 100,
    currentPity: 0,
    isActive: true,
  },
];

export class MockSummonRepository implements ISummonRepository {
  private banners = [...MOCK_BANNERS];
  private stats: SummonStats = {
    totalSummons: 50,
    legendaryPulled: 2,
    mythicPulled: 0,
    currentTickets: 15,
  };

  async getBanners(): Promise<SummonBanner[]> {
    await this.delay(100);
    return this.banners.filter((b) => b.isActive);
  }

  async getBannerById(id: string): Promise<SummonBanner | null> {
    await this.delay(100);
    return this.banners.find((b) => b.id === id) || null;
  }

  async summonSingle(bannerId: string): Promise<SummonResult> {
    await this.delay(500);
    const banner = this.banners.find((b) => b.id === bannerId);
    if (!banner) throw new Error("Banner not found");

    const rarity = rollRarity(banner.currentPity);
    const character = generateCharacter(rarity);
    const isNew = Math.random() > 0.5;

    banner.currentPity = rarity === "legendary" || rarity === "mythic" ? 0 : banner.currentPity + 1;
    this.stats.totalSummons++;
    if (rarity === "legendary") this.stats.legendaryPulled++;
    if (rarity === "mythic") this.stats.mythicPulled++;

    return {
      characters: [{ character, isNew, fragmentsGained: isNew ? 0 : 10 }],
      isNew: [isNew],
      pityReached: banner.currentPity === 0 && (rarity === "legendary" || rarity === "mythic"),
    };
  }

  async summonMulti(bannerId: string): Promise<SummonResult> {
    await this.delay(800);
    const banner = this.banners.find((b) => b.id === bannerId);
    if (!banner) throw new Error("Banner not found");

    const results: SummonedCharacter[] = [];
    const isNewList: boolean[] = [];
    let pityReached = false;

    for (let i = 0; i < 10; i++) {
      // Guarantee at least one rare on multi
      const rarity = i === 9 && results.every((r) => ["common", "uncommon"].includes(r.character.rarity))
        ? "rare"
        : rollRarity(banner.currentPity);
      
      const character = generateCharacter(rarity);
      const isNew = Math.random() > 0.5;

      if (rarity === "legendary" || rarity === "mythic") {
        banner.currentPity = 0;
        pityReached = true;
        if (rarity === "legendary") this.stats.legendaryPulled++;
        if (rarity === "mythic") this.stats.mythicPulled++;
      } else {
        banner.currentPity++;
      }

      results.push({ character, isNew, fragmentsGained: isNew ? 0 : 10 });
      isNewList.push(isNew);
    }

    this.stats.totalSummons += 10;

    return { characters: results, isNew: isNewList, pityReached };
  }

  async getStats(): Promise<SummonStats> {
    await this.delay(100);
    return { ...this.stats };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockSummonRepository = new MockSummonRepository();
