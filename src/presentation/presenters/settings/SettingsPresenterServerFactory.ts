import { MockSettingsRepository } from "@/src/infrastructure/repositories/mock/MockSettingsRepository";
import { SettingsPresenter } from "./SettingsPresenter";

export class SettingsPresenterServerFactory {
  static create(): SettingsPresenter {
    const repository = new MockSettingsRepository();
    return new SettingsPresenter(repository);
  }
}

export function createServerSettingsPresenter(): SettingsPresenter {
  return SettingsPresenterServerFactory.create();
}
