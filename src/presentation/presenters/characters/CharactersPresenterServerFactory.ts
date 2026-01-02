/**
 * CharactersPresenterServerFactory
 * Factory for creating CharactersPresenter on server side
 */

import { MockCharacterRepository } from "@/src/infrastructure/repositories/mock/MockCharacterRepository";
import { CharactersPresenter } from "./CharactersPresenter";

export class CharactersPresenterServerFactory {
  static create(): CharactersPresenter {
    const repository = new MockCharacterRepository();
    return new CharactersPresenter(repository);
  }
}

export function createServerCharactersPresenter(): CharactersPresenter {
  return CharactersPresenterServerFactory.create();
}
