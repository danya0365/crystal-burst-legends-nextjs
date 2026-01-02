import { Achievement, AchievementCategory, AchievementStats, IAchievementRepository } from "@/src/application/repositories/IAchievementRepository";
import { Metadata } from "next";

export interface AchievementsViewModel {
  achievements: Achievement[];
  stats: AchievementStats;
  selectedCategory: AchievementCategory | "all";
}

export class AchievementsPresenter {
  constructor(private readonly repository: IAchievementRepository) {}

  async getViewModel(category: AchievementCategory | "all" = "all"): Promise<AchievementsViewModel> {
    const [achievements, stats] = await Promise.all([
      category === "all" ? this.repository.getAll() : this.repository.getByCategory(category),
      this.repository.getStats(),
    ]);
    return { achievements, stats, selectedCategory: category };
  }

  generateMetadata(): Metadata {
    return {
      title: "Achievements | Crystal Burst Legends",
      description: "Track your achievements and earn rewards",
    };
  }

  async claim(id: string): Promise<Achievement> {
    return this.repository.claim(id);
  }
}
