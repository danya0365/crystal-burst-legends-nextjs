/**
 * LegalPresenterClientFactory
 * Factory for creating LegalPresenter on client side
 */

"use client";

import { MockLegalRepository } from "@/src/infrastructure/repositories/mock/MockLegalRepository";
import { LegalPresenter } from "./LegalPresenter";

export class LegalPresenterClientFactory {
  static create(): LegalPresenter {
    const repository = new MockLegalRepository();
    return new LegalPresenter(repository);
  }
}

export function createClientLegalPresenter(): LegalPresenter {
  return LegalPresenterClientFactory.create();
}
