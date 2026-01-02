/**
 * ICharacterRepository
 * Repository interface for Character data access
 * Following Clean Architecture - Application layer
 */

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
export type Element = "fire" | "water" | "earth" | "wind" | "light" | "dark";
export type CharacterClass = "warrior" | "mage" | "assassin" | "tank" | "support";

export interface Character {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  element: Element;
  characterClass: CharacterClass;
  level: number;
  maxLevel: number;
  stars: number;
  maxStars: number;
  power: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  imageUrl?: string;
  skills: Skill[];
  isOwned: boolean;
  fragments: number;
  fragmentsRequired: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  damage: number;
  cooldown: number;
  type: "attack" | "defense" | "buff" | "debuff" | "heal";
}

export interface CharacterStats {
  totalCharacters: number;
  ownedCharacters: number;
  legendaryCount: number;
  mythicCount: number;
  averagePower: number;
}

export interface CharacterFilter {
  rarity?: Rarity;
  element?: Element;
  characterClass?: CharacterClass;
  owned?: boolean;
  searchTerm?: string;
}

export interface ICharacterRepository {
  getById(id: string): Promise<Character | null>;
  getAll(): Promise<Character[]>;
  getOwned(): Promise<Character[]>;
  getByFilter(filter: CharacterFilter): Promise<Character[]>;
  getStats(): Promise<CharacterStats>;
  levelUp(id: string): Promise<Character>;
  evolve(id: string): Promise<Character>;
  unlock(id: string): Promise<Character>;
}
