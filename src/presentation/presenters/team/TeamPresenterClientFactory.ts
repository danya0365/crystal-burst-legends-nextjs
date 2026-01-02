"use client";

import { MockTeamRepository } from "@/src/infrastructure/repositories/mock/MockTeamRepository";
import { TeamPresenter } from "./TeamPresenter";

export class TeamPresenterClientFactory {
  static create(): TeamPresenter {
    const repository = new MockTeamRepository();
    return new TeamPresenter(repository);
  }
}

export function createClientTeamPresenter(): TeamPresenter {
  return TeamPresenterClientFactory.create();
}
