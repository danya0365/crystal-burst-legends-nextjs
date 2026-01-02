"use client";

import { MockAchievementRepository } from "@/src/infrastructure/repositories/mock/MockAchievementRepository";
import { AchievementsPresenter } from "./AchievementsPresenter";

export function createClientAchievementsPresenter(): AchievementsPresenter {
  return new AchievementsPresenter(new MockAchievementRepository());
}
