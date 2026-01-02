/**
 * CharactersPresenter
 * Handles business logic for Characters management
 */

import {
    Character,
    CharacterFilter,
    CharacterStats,
    ICharacterRepository,
} from "@/src/application/repositories/ICharacterRepository";
import { Metadata } from "next";

export interface CharactersViewModel {
  characters: Character[];
  ownedCharacters: Character[];
  stats: CharacterStats;
  selectedCharacter: Character | null;
  filter: CharacterFilter;
}

export class CharactersPresenter {
  constructor(private readonly repository: ICharacterRepository) {}

  async getViewModel(filter?: CharacterFilter): Promise<CharactersViewModel> {
    try {
      const [characters, ownedCharacters, stats] = await Promise.all([
        filter ? this.repository.getByFilter(filter) : this.repository.getAll(),
        this.repository.getOwned(),
        this.repository.getStats(),
      ]);

      return {
        characters,
        ownedCharacters,
        stats,
        selectedCharacter: null,
        filter: filter || {},
      };
    } catch (error) {
      console.error("Error getting characters view model:", error);
      throw error;
    }
  }

  generateMetadata(): Metadata {
    return {
      title: "Characters | Crystal Burst Legends",
      description: "Manage and upgrade your characters in Crystal Burst Legends",
    };
  }

  async getCharacterById(id: string): Promise<Character | null> {
    return this.repository.getById(id);
  }

  async levelUp(id: string): Promise<Character> {
    return this.repository.levelUp(id);
  }

  async evolve(id: string): Promise<Character> {
    return this.repository.evolve(id);
  }

  async unlock(id: string): Promise<Character> {
    return this.repository.unlock(id);
  }

  async getStats(): Promise<CharacterStats> {
    return this.repository.getStats();
  }
}
