/**
 * GachaPresenterClientFactory
 */

"use client";

import { MockGachaRepository } from "@/src/infrastructure/repositories/mock/MockGachaRepository";
import { GachaPresenter } from "./GachaPresenter";

// ใช้ singleton เพื่อให้ crystals persist
let presenterInstance: GachaPresenter | null = null;
let repositoryInstance: MockGachaRepository | null = null;

export class GachaPresenterClientFactory {
  static create(): GachaPresenter {
    if (!presenterInstance) {
      repositoryInstance = new MockGachaRepository();
      presenterInstance = new GachaPresenter(repositoryInstance);
    }
    return presenterInstance;
  }
}

export function createClientGachaPresenter(): GachaPresenter {
  return GachaPresenterClientFactory.create();
}
