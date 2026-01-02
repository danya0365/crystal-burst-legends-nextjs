import { IMissionRepository, Mission, MissionStats, MissionType } from "@/src/application/repositories/IMissionRepository";
import { Metadata } from "next";

export interface MissionsViewModel {
  missions: Mission[];
  stats: MissionStats;
  selectedType: MissionType;
}

export class MissionsPresenter {
  constructor(private readonly repository: IMissionRepository) {}

  async getViewModel(type: MissionType = "daily"): Promise<MissionsViewModel> {
    const [missions, stats] = await Promise.all([
      this.repository.getByType(type),
      this.repository.getStats(),
    ]);
    return { missions, stats, selectedType: type };
  }

  generateMetadata(): Metadata {
    return {
      title: "Missions | Crystal Burst Legends",
      description: "Complete daily and weekly missions for rewards",
    };
  }

  async getMissionsByType(type: MissionType): Promise<Mission[]> {
    return this.repository.getByType(type);
  }

  async claimMission(id: string): Promise<Mission> {
    return this.repository.claim(id);
  }

  async getStats(): Promise<MissionStats> {
    return this.repository.getStats();
  }
}
