/**
 * MockMissionRepository
 * Mock implementation for Missions data
 */

import {
    IMissionRepository,
    Mission,
    MissionStats,
    MissionType,
} from "@/src/application/repositories/IMissionRepository";

const MOCK_MISSIONS: Mission[] = [
  // Daily Missions
  { id: "d1", type: "daily", title: "Complete 3 Story Stages", description: "Clear any 3 story stages", status: "available", progress: 1, target: 3, rewards: [{ type: "crystal", name: "Crystals", amount: 30 }] },
  { id: "d2", type: "daily", title: "Win 2 PVP Battles", description: "Win 2 battles in PVP Arena", status: "available", progress: 2, target: 2, rewards: [{ type: "coin", name: "Coins", amount: 5000 }] },
  { id: "d3", type: "daily", title: "Summon 1 Character", description: "Perform any summon", status: "completed", progress: 1, target: 1, rewards: [{ type: "crystal", name: "Crystals", amount: 20 }] },
  { id: "d4", type: "daily", title: "Level Up a Character", description: "Level up any character once", status: "available", progress: 0, target: 1, rewards: [{ type: "exp", name: "Player EXP", amount: 100 }] },
  { id: "d5", type: "daily", title: "Login Today", description: "Login to the game", status: "claimed", progress: 1, target: 1, rewards: [{ type: "crystal", name: "Crystals", amount: 10 }] },
  // Weekly Missions
  { id: "w1", type: "weekly", title: "Complete 20 Story Stages", description: "Clear 20 story stages this week", status: "available", progress: 12, target: 20, rewards: [{ type: "crystal", name: "Crystals", amount: 200 }] },
  { id: "w2", type: "weekly", title: "Win 15 PVP Battles", description: "Win 15 PVP battles this week", status: "available", progress: 8, target: 15, rewards: [{ type: "fragment", name: "Random Fragment", amount: 20 }] },
  { id: "w3", type: "weekly", title: "Evolve a Character", description: "Evolve any character to higher star", status: "available", progress: 0, target: 1, rewards: [{ type: "crystal", name: "Crystals", amount: 150 }] },
  // Achievements
  { id: "a1", type: "achievement", title: "First Victory", description: "Win your first PVP battle", status: "claimed", progress: 1, target: 1, rewards: [{ type: "crystal", name: "Crystals", amount: 50 }] },
  { id: "a2", type: "achievement", title: "Collector I", description: "Own 5 different characters", status: "completed", progress: 6, target: 5, rewards: [{ type: "crystal", name: "Crystals", amount: 100 }] },
  { id: "a3", type: "achievement", title: "Collector II", description: "Own 10 different characters", status: "available", progress: 6, target: 10, rewards: [{ type: "crystal", name: "Crystals", amount: 300 }] },
  { id: "a4", type: "achievement", title: "Power Up!", description: "Reach 10,000 total team power", status: "available", progress: 8500, target: 10000, rewards: [{ type: "crystal", name: "Crystals", amount: 200 }] },
];

export class MockMissionRepository implements IMissionRepository {
  private missions = [...MOCK_MISSIONS];

  async getAll(): Promise<Mission[]> {
    await this.delay(100);
    return [...this.missions];
  }

  async getByType(type: MissionType): Promise<Mission[]> {
    await this.delay(100);
    return this.missions.filter((m) => m.type === type);
  }

  async claim(id: string): Promise<Mission> {
    await this.delay(200);
    const index = this.missions.findIndex((m) => m.id === id);
    if (index === -1) throw new Error("Mission not found");
    if (this.missions[index].status !== "completed") throw new Error("Mission not completed");
    
    this.missions[index] = { ...this.missions[index], status: "claimed" };
    return this.missions[index];
  }

  async getStats(): Promise<MissionStats> {
    await this.delay(100);
    const daily = this.missions.filter((m) => m.type === "daily");
    const weekly = this.missions.filter((m) => m.type === "weekly");
    return {
      dailyCompleted: daily.filter((m) => m.status === "completed" || m.status === "claimed").length,
      dailyTotal: daily.length,
      weeklyCompleted: weekly.filter((m) => m.status === "completed" || m.status === "claimed").length,
      weeklyTotal: weekly.length,
      refreshIn: 8 * 60 * 60,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
