/**
 * ITeamRepository
 * Repository interface for Team Formation data access
 */

import { Character } from "./ICharacterRepository";

export interface Team {
  id: string;
  name: string;
  slots: (TeamSlot | null)[];
  totalPower: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamSlot {
  position: number;
  character: Character;
}

export interface TeamStats {
  teamsCount: number;
  maxTeams: number;
  bestTeamPower: number;
}

export interface ITeamRepository {
  getTeams(): Promise<Team[]>;
  getActiveTeam(): Promise<Team | null>;
  saveTeam(team: Team): Promise<Team>;
  setActiveTeam(teamId: string): Promise<Team>;
  getAvailableCharacters(): Promise<Character[]>;
}
