/**
 * MockAchievementRepository
 */

import {
    Achievement,
    AchievementCategory,
    AchievementStats,
    IAchievementRepository,
} from "@/src/application/repositories/IAchievementRepository";

const MOCK_ACHIEVEMENTS: Achievement[] = [
  // Combat
  { id: "c1", title: "First Blood", description: "Win your first battle", category: "combat", icon: "⚔️", progress: 1, target: 1, completed: true, claimed: true, reward: { type: "crystal", name: "Crystals", amount: 50 } },
  { id: "c2", title: "Champion", description: "Win 100 PVP battles", category: "combat", icon: "🏆", progress: 45, target: 100, completed: false, claimed: false, reward: { type: "crystal", name: "Crystals", amount: 500 } },
  { id: "c3", title: "Perfect Victory", description: "Win without taking damage", category: "combat", icon: "✨", progress: 1, target: 1, completed: true, claimed: false, reward: { type: "title", name: "The Untouchable", amount: 1 } },
  
  // Collection
  { id: "co1", title: "Collector I", description: "Collect 5 characters", category: "collection", icon: "👥", progress: 6, target: 5, completed: true, claimed: true, reward: { type: "crystal", name: "Crystals", amount: 100 } },
  { id: "co2", title: "Collector II", description: "Collect 10 characters", category: "collection", icon: "👥", progress: 6, target: 10, completed: false, claimed: false, reward: { type: "crystal", name: "Crystals", amount: 300 } },
  { id: "co3", title: "Legendary Hunter", description: "Obtain a legendary character", category: "collection", icon: "🌟", progress: 1, target: 1, completed: true, claimed: false, reward: { type: "avatar", name: "Golden Avatar", amount: 1 } },
  
  // Progression
  { id: "p1", title: "Rising Star", description: "Reach player level 10", category: "progression", icon: "📈", progress: 15, target: 10, completed: true, claimed: true, reward: { type: "crystal", name: "Crystals", amount: 200 } },
  { id: "p2", title: "Story Seeker", description: "Complete Chapter 1", category: "progression", icon: "📖", progress: 1, target: 1, completed: true, claimed: true, reward: { type: "crystal", name: "Crystals", amount: 100 } },
  { id: "p3", title: "Power Up", description: "Reach 50,000 total power", category: "progression", icon: "💪", progress: 28500, target: 50000, completed: false, claimed: false, reward: { type: "crystal", name: "Crystals", amount: 1000 } },
  
  // Social
  { id: "s1", title: "Team Player", description: "Join a guild", category: "social", icon: "🤝", progress: 0, target: 1, completed: false, claimed: false, reward: { type: "crystal", name: "Crystals", amount: 100 } },
  { id: "s2", title: "Friendly", description: "Add 5 friends", category: "social", icon: "👋", progress: 2, target: 5, completed: false, claimed: false, reward: { type: "crystal", name: "Crystals", amount: 150 } },
  
  // Special
  { id: "sp1", title: "Early Bird", description: "Login 7 days in a row", category: "special", icon: "🐦", progress: 7, target: 7, completed: true, claimed: false, reward: { type: "crystal", name: "Crystals", amount: 200 } },
  { id: "sp2", title: "Big Spender", description: "Spend 10,000 coins", category: "special", icon: "💰", progress: 8500, target: 10000, completed: false, claimed: false, reward: { type: "crystal", name: "Crystals", amount: 300 } },
];

export class MockAchievementRepository implements IAchievementRepository {
  private achievements = [...MOCK_ACHIEVEMENTS];

  async getAll(): Promise<Achievement[]> {
    await this.delay(100);
    return [...this.achievements];
  }

  async getByCategory(category: AchievementCategory): Promise<Achievement[]> {
    await this.delay(100);
    return this.achievements.filter((a) => a.category === category);
  }

  async claim(id: string): Promise<Achievement> {
    await this.delay(150);
    const index = this.achievements.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("Achievement not found");
    if (!this.achievements[index].completed) throw new Error("Achievement not completed");
    if (this.achievements[index].claimed) throw new Error("Already claimed");
    
    this.achievements[index] = { ...this.achievements[index], claimed: true };
    return this.achievements[index];
  }

  async getStats(): Promise<AchievementStats> {
    await this.delay(50);
    return {
      total: this.achievements.length,
      completed: this.achievements.filter((a) => a.completed).length,
      points: this.achievements.filter((a) => a.completed).length * 10,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
