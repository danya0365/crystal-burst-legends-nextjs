/**
 * LandingPresenterServerFactory
 * Factory for creating LandingPresenter on server side
 */

import { MockLandingRepository } from "@/src/infrastructure/repositories/mock/MockLandingRepository";
import { LandingPresenter } from "./LandingPresenter";

export class LandingPresenterServerFactory {
  static create(): LandingPresenter {
    const repository = new MockLandingRepository();
    return new LandingPresenter(repository);
  }
}

export function createServerLandingPresenter(): LandingPresenter {
  return LandingPresenterServerFactory.create();
}
