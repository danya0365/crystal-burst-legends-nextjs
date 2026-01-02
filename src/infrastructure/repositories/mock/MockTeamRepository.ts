/**
 * MockTeamRepository
 * Mock implementation for Team Formation data
 */

import { Character } from "@/src/application/repositories/ICharacterRepository";
import {
    ITeamRepository,
    Team,
    TeamSlot,
} from "@/src/application/repositories/ITeamRepository";
import { MockCharacterRepository } from "./MockCharacterRepository";

const characterRepo = new MockCharacterRepository();

export class MockTeamRepository implements ITeamRepository {
  private activeTeamId: string = "team-1";
  private teams: Team[] = [];

  async getTeams(): Promise<Team[]> {
    await this.delay(100);
    if (this.teams.length === 0) {
      // Initialize with a default team
      const characters = await characterRepo.getOwned();
      const slots: (TeamSlot | null)[] = characters.slice(0, 3).map((c, i) => ({
        position: i,
        character: c,
      }));
      // Fill remaining slots with null
      while (slots.length < 5) {
        slots.push(null);
      }
      
      this.teams = [{
        id: "team-1",
        name: "Main Team",
        slots,
        totalPower: slots.reduce((sum, s) => sum + (s?.character.power || 0), 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }];
    }
    return [...this.teams];
  }

  async getActiveTeam(): Promise<Team | null> {
    await this.delay(100);
    const teams = await this.getTeams();
    return teams.find((t) => t.id === this.activeTeamId) || teams[0] || null;
  }

  async saveTeam(team: Team): Promise<Team> {
    await this.delay(200);
    const index = this.teams.findIndex((t) => t.id === team.id);
    const updatedTeam: Team = {
      ...team,
      totalPower: team.slots.reduce((sum, s) => sum + (s?.character.power || 0), 0),
      updatedAt: new Date().toISOString(),
    };
    
    if (index >= 0) {
      this.teams[index] = updatedTeam;
    } else {
      this.teams.push(updatedTeam);
    }
    return updatedTeam;
  }

  async setActiveTeam(teamId: string): Promise<Team> {
    await this.delay(100);
    this.activeTeamId = teamId;
    const team = this.teams.find((t) => t.id === teamId);
    if (!team) throw new Error("Team not found");
    return team;
  }

  async getAvailableCharacters(): Promise<Character[]> {
    await this.delay(100);
    return characterRepo.getOwned();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockTeamRepository = new MockTeamRepository();
