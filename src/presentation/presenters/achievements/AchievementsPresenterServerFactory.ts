import { MockAchievementRepository } from "@/src/infrastructure/repositories/mock/MockAchievementRepository";
import { AchievementsPresenter } from "./AchievementsPresenter";

export function createServerAchievementsPresenter(): AchievementsPresenter {
  return new AchievementsPresenter(new MockAchievementRepository());
}
