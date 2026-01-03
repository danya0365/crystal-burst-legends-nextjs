/**
 * LandingPresenterClientFactory
 * Factory for creating LandingPresenter on client side
 */

"use client";

import { MockLandingRepository } from "@/src/infrastructure/repositories/mock/MockLandingRepository";
import { LandingPresenter } from "./LandingPresenter";

export class LandingPresenterClientFactory {
  static create(): LandingPresenter {
    const repository = new MockLandingRepository();
    return new LandingPresenter(repository);
  }
}

export function createClientLandingPresenter(): LandingPresenter {
  return LandingPresenterClientFactory.create();
}
