/**
 * LegalPresenterServerFactory
 * Factory for creating LegalPresenter on server side
 */

import { MockLegalRepository } from "@/src/infrastructure/repositories/mock/MockLegalRepository";
import { LegalPresenter } from "./LegalPresenter";

export class LegalPresenterServerFactory {
  static create(): LegalPresenter {
    const repository = new MockLegalRepository();
    return new LegalPresenter(repository);
  }
}

export function createServerLegalPresenter(): LegalPresenter {
  return LegalPresenterServerFactory.create();
}
