"use client";

import { MockSettingsRepository } from "@/src/infrastructure/repositories/mock/MockSettingsRepository";
import { SettingsPresenter } from "./SettingsPresenter";

export class SettingsPresenterClientFactory {
  static create(): SettingsPresenter {
    const repository = new MockSettingsRepository();
    return new SettingsPresenter(repository);
  }
}

export function createClientSettingsPresenter(): SettingsPresenter {
  return SettingsPresenterClientFactory.create();
}
