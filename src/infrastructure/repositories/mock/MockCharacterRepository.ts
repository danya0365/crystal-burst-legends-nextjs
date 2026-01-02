/**
 * MockCharacterRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure layer
 */

import {
    Character,
    CharacterFilter,
    CharacterStats,
    ICharacterRepository,
    Skill
} from "@/src/application/repositories/ICharacterRepository";

// Mock Skills Data
const MOCK_SKILLS: Record<string, Skill[]> = {
  warrior: [
    { id: "s1", name: "Power Strike", description: "A powerful sword strike", damage: 150, cooldown: 2, type: "attack" },
    { id: "s2", name: "Shield Bash", description: "Stun the enemy", damage: 80, cooldown: 4, type: "attack" },
  ],
  mage: [
    { id: "s3", name: "Fireball", description: "Launch a fireball", damage: 200, cooldown: 3, type: "attack" },
    { id: "s4", name: "Ice Shield", description: "Create protective ice", damage: 0, cooldown: 5, type: "defense" },
  ],
  assassin: [
    { id: "s5", name: "Shadow Strike", description: "Attack from shadows", damage: 250, cooldown: 4, type: "attack" },
    { id: "s6", name: "Poison Blade", description: "Apply poison", damage: 100, cooldown: 3, type: "debuff" },
  ],
  tank: [
    { id: "s7", name: "Fortress", description: "Increase defense", damage: 0, cooldown: 6, type: "defense" },
    { id: "s8", name: "Taunt", description: "Force enemies to attack", damage: 50, cooldown: 4, type: "buff" },
  ],
  support: [
    { id: "s9", name: "Heal", description: "Restore HP", damage: -150, cooldown: 3, type: "heal" },
    { id: "s10", name: "Blessing", description: "Boost ally stats", damage: 0, cooldown: 5, type: "buff" },
  ],
};

// Mock Characters Data
const MOCK_CHARACTERS: Character[] = [
  {
    id: "char-001",
    name: "Crystal Knight",
    description: "A legendary warrior infused with crystal power",
    rarity: "legendary",
    element: "light",
    characterClass: "warrior",
    level: 50,
    maxLevel: 100,
    stars: 5,
    maxStars: 7,
    power: 12500,
    hp: 8000,
    attack: 1200,
    defense: 800,
    speed: 150,
    imageUrl: "/images/characters/crystal-knight.png",
    skills: MOCK_SKILLS.warrior,
    isOwned: true,
    fragments: 50,
    fragmentsRequired: 100,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  },
  {
    id: "char-002",
    name: "Shadow Assassin",
    description: "Master of stealth and deadly strikes",
    rarity: "epic",
    element: "dark",
    characterClass: "assassin",
    level: 45,
    maxLevel: 80,
    stars: 4,
    maxStars: 6,
    power: 9800,
    hp: 5500,
    attack: 1500,
    defense: 400,
    speed: 200,
    imageUrl: "/images/characters/shadow-assassin.png",
    skills: MOCK_SKILLS.assassin,
    isOwned: true,
    fragments: 30,
    fragmentsRequired: 80,
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-14T09:00:00.000Z",
  },
  {
    id: "char-003",
    name: "Flame Mage",
    description: "Wielder of ancient fire magic",
    rarity: "rare",
    element: "fire",
    characterClass: "mage",
    level: 35,
    maxLevel: 60,
    stars: 3,
    maxStars: 5,
    power: 6500,
    hp: 4000,
    attack: 1100,
    defense: 350,
    speed: 120,
    imageUrl: "/images/characters/flame-mage.png",
    skills: MOCK_SKILLS.mage,
    isOwned: true,
    fragments: 25,
    fragmentsRequired: 50,
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-01-13T08:00:00.000Z",
  },
  {
    id: "char-004",
    name: "Ocean Guardian",
    description: "Ancient protector of the seas",
    rarity: "legendary",
    element: "water",
    characterClass: "tank",
    level: 55,
    maxLevel: 100,
    stars: 5,
    maxStars: 7,
    power: 13200,
    hp: 12000,
    attack: 700,
    defense: 1500,
    speed: 80,
    imageUrl: "/images/characters/ocean-guardian.png",
    skills: MOCK_SKILLS.tank,
    isOwned: false,
    fragments: 45,
    fragmentsRequired: 100,
    createdAt: "2024-01-04T00:00:00.000Z",
    updatedAt: "2024-01-12T07:00:00.000Z",
  },
  {
    id: "char-005",
    name: "Wind Spirit",
    description: "Swift healer from the mountain peaks",
    rarity: "epic",
    element: "wind",
    characterClass: "support",
    level: 40,
    maxLevel: 80,
    stars: 4,
    maxStars: 6,
    power: 8200,
    hp: 6000,
    attack: 600,
    defense: 600,
    speed: 180,
    imageUrl: "/images/characters/wind-spirit.png",
    skills: MOCK_SKILLS.support,
    isOwned: true,
    fragments: 40,
    fragmentsRequired: 80,
    createdAt: "2024-01-05T00:00:00.000Z",
    updatedAt: "2024-01-11T06:00:00.000Z",
  },
  {
    id: "char-006",
    name: "Earth Golem",
    description: "Immovable fortress of stone",
    rarity: "rare",
    element: "earth",
    characterClass: "tank",
    level: 30,
    maxLevel: 60,
    stars: 3,
    maxStars: 5,
    power: 5800,
    hp: 9000,
    attack: 500,
    defense: 1200,
    speed: 50,
    imageUrl: "/images/characters/earth-golem.png",
    skills: MOCK_SKILLS.tank,
    isOwned: true,
    fragments: 20,
    fragmentsRequired: 50,
    createdAt: "2024-01-06T00:00:00.000Z",
    updatedAt: "2024-01-10T05:00:00.000Z",
  },
  {
    id: "char-007",
    name: "Phoenix Lord",
    description: "Mythical being of eternal flame",
    rarity: "mythic",
    element: "fire",
    characterClass: "mage",
    level: 70,
    maxLevel: 120,
    stars: 6,
    maxStars: 7,
    power: 18500,
    hp: 7000,
    attack: 2000,
    defense: 600,
    speed: 160,
    imageUrl: "/images/characters/phoenix-lord.png",
    skills: MOCK_SKILLS.mage,
    isOwned: false,
    fragments: 10,
    fragmentsRequired: 150,
    createdAt: "2024-01-07T00:00:00.000Z",
    updatedAt: "2024-01-09T04:00:00.000Z",
  },
  {
    id: "char-008",
    name: "Frost Archer",
    description: "Master archer with ice-enchanted arrows",
    rarity: "uncommon",
    element: "water",
    characterClass: "assassin",
    level: 20,
    maxLevel: 40,
    stars: 2,
    maxStars: 4,
    power: 3200,
    hp: 3500,
    attack: 800,
    defense: 300,
    speed: 170,
    imageUrl: "/images/characters/frost-archer.png",
    skills: MOCK_SKILLS.assassin,
    isOwned: true,
    fragments: 15,
    fragmentsRequired: 30,
    createdAt: "2024-01-08T00:00:00.000Z",
    updatedAt: "2024-01-08T03:00:00.000Z",
  },
];

export class MockCharacterRepository implements ICharacterRepository {
  private characters: Character[] = [...MOCK_CHARACTERS];

  async getById(id: string): Promise<Character | null> {
    await this.delay(100);
    return this.characters.find((c) => c.id === id) || null;
  }

  async getAll(): Promise<Character[]> {
    await this.delay(100);
    return [...this.characters];
  }

  async getOwned(): Promise<Character[]> {
    await this.delay(100);
    return this.characters.filter((c) => c.isOwned);
  }

  async getByFilter(filter: CharacterFilter): Promise<Character[]> {
    await this.delay(100);
    let result = [...this.characters];

    if (filter.rarity) {
      result = result.filter((c) => c.rarity === filter.rarity);
    }
    if (filter.element) {
      result = result.filter((c) => c.element === filter.element);
    }
    if (filter.characterClass) {
      result = result.filter((c) => c.characterClass === filter.characterClass);
    }
    if (filter.owned !== undefined) {
      result = result.filter((c) => c.isOwned === filter.owned);
    }
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(term));
    }

    return result;
  }

  async getStats(): Promise<CharacterStats> {
    await this.delay(100);
    const owned = this.characters.filter((c) => c.isOwned);
    const totalPower = owned.reduce((sum, c) => sum + c.power, 0);

    return {
      totalCharacters: this.characters.length,
      ownedCharacters: owned.length,
      legendaryCount: owned.filter((c) => c.rarity === "legendary").length,
      mythicCount: owned.filter((c) => c.rarity === "mythic").length,
      averagePower: owned.length > 0 ? Math.round(totalPower / owned.length) : 0,
    };
  }

  async levelUp(id: string): Promise<Character> {
    await this.delay(200);
    const index = this.characters.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Character not found");

    const character = this.characters[index];
    if (character.level >= character.maxLevel) {
      throw new Error("Character already at max level");
    }

    const updated: Character = {
      ...character,
      level: character.level + 1,
      power: character.power + 100,
      hp: character.hp + 50,
      attack: character.attack + 10,
      defense: character.defense + 5,
      updatedAt: new Date().toISOString(),
    };

    this.characters[index] = updated;
    return updated;
  }

  async evolve(id: string): Promise<Character> {
    await this.delay(300);
    const index = this.characters.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Character not found");

    const character = this.characters[index];
    if (character.stars >= character.maxStars) {
      throw new Error("Character already at max stars");
    }
    if (character.fragments < character.fragmentsRequired) {
      throw new Error("Not enough fragments");
    }

    const updated: Character = {
      ...character,
      stars: character.stars + 1,
      fragments: character.fragments - character.fragmentsRequired,
      power: character.power + 500,
      maxLevel: character.maxLevel + 10,
      updatedAt: new Date().toISOString(),
    };

    this.characters[index] = updated;
    return updated;
  }

  async unlock(id: string): Promise<Character> {
    await this.delay(300);
    const index = this.characters.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Character not found");

    const character = this.characters[index];
    if (character.isOwned) {
      throw new Error("Character already owned");
    }
    if (character.fragments < character.fragmentsRequired) {
      throw new Error("Not enough fragments to unlock");
    }

    const updated: Character = {
      ...character,
      isOwned: true,
      fragments: character.fragments - character.fragmentsRequired,
      updatedAt: new Date().toISOString(),
    };

    this.characters[index] = updated;
    return updated;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockCharacterRepository = new MockCharacterRepository();
