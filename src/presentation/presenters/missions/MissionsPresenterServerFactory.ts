import { MockMissionRepository } from "@/src/infrastructure/repositories/mock/MockMissionRepository";
import { MissionsPresenter } from "./MissionsPresenter";

export class MissionsPresenterServerFactory {
  static create(): MissionsPresenter {
    const repository = new MockMissionRepository();
    return new MissionsPresenter(repository);
  }
}

export function createServerMissionsPresenter(): MissionsPresenter {
  return MissionsPresenterServerFactory.create();
}
