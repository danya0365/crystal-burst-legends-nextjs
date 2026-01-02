import { MockTeamRepository } from "@/src/infrastructure/repositories/mock/MockTeamRepository";
import { TeamPresenter } from "./TeamPresenter";

export class TeamPresenterServerFactory {
  static create(): TeamPresenter {
    const repository = new MockTeamRepository();
    return new TeamPresenter(repository);
  }
}

export function createServerTeamPresenter(): TeamPresenter {
  return TeamPresenterServerFactory.create();
}
