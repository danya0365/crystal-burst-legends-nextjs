import { Character } from "@/src/application/repositories/ICharacterRepository";
import { ITeamRepository, Team } from "@/src/application/repositories/ITeamRepository";
import { Metadata } from "next";

export interface TeamViewModel {
  activeTeam: Team | null;
  availableCharacters: Character[];
  totalPower: number;
}

export class TeamPresenter {
  constructor(private readonly repository: ITeamRepository) {}

  async getViewModel(): Promise<TeamViewModel> {
    const [activeTeam, availableCharacters] = await Promise.all([
      this.repository.getActiveTeam(),
      this.repository.getAvailableCharacters(),
    ]);
    return {
      activeTeam,
      availableCharacters,
      totalPower: activeTeam?.totalPower || 0,
    };
  }

  generateMetadata(): Metadata {
    return {
      title: "Team Formation | Crystal Burst Legends",
      description: "Build and manage your battle team",
    };
  }

  async saveTeam(team: Team): Promise<Team> {
    return this.repository.saveTeam(team);
  }

  async getAvailableCharacters(): Promise<Character[]> {
    return this.repository.getAvailableCharacters();
  }
}
