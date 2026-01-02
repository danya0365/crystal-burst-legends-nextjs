/**
 * CharactersPresenterClientFactory
 * Factory for creating CharactersPresenter on client side
 */

"use client";

import { MockCharacterRepository } from "@/src/infrastructure/repositories/mock/MockCharacterRepository";
import { CharactersPresenter } from "./CharactersPresenter";

export class CharactersPresenterClientFactory {
  static create(): CharactersPresenter {
    const repository = new MockCharacterRepository();
    return new CharactersPresenter(repository);
  }
}

export function createClientCharactersPresenter(): CharactersPresenter {
  return CharactersPresenterClientFactory.create();
}
