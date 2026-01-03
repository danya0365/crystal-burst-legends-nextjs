/**
 * GachaPresenterServerFactory
 */

import { MockGachaRepository } from "@/src/infrastructure/repositories/mock/MockGachaRepository";
import { GachaPresenter } from "./GachaPresenter";

export class GachaPresenterServerFactory {
  static create(): GachaPresenter {
    const repository = new MockGachaRepository();
    return new GachaPresenter(repository);
  }
}

export function createServerGachaPresenter(): GachaPresenter {
  return GachaPresenterServerFactory.create();
}
