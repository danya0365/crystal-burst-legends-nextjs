"use client";

import { MockMissionRepository } from "@/src/infrastructure/repositories/mock/MockMissionRepository";
import { MissionsPresenter } from "./MissionsPresenter";

export class MissionsPresenterClientFactory {
  static create(): MissionsPresenter {
    const repository = new MockMissionRepository();
    return new MissionsPresenter(repository);
  }
}

export function createClientMissionsPresenter(): MissionsPresenter {
  return MissionsPresenterClientFactory.create();
}
