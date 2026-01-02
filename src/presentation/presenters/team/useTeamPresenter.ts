"use client";

import type { Character } from "@/src/application/repositories/ICharacterRepository";
import type { TeamSlot } from "@/src/application/repositories/ITeamRepository";
import { useCallback, useEffect, useState } from "react";
import { TeamViewModel } from "./TeamPresenter";
import { createClientTeamPresenter } from "./TeamPresenterClientFactory";

const presenter = createClientTeamPresenter();

export interface TeamPresenterState {
  viewModel: TeamViewModel | null;
  loading: boolean;
  error: string | null;
  team: (Character | null)[];
  selectedSlot: number | null;
}

export interface TeamPresenterActions {
  loadData: () => Promise<void>;
  selectSlot: (slot: number | null) => void;
  addToTeam: (character: Character) => void;
  removeFromTeam: (slot: number) => void;
  saveTeam: () => Promise<void>;
  setError: (error: string | null) => void;
}

export function useTeamPresenter(
  initialViewModel?: TeamViewModel
): [TeamPresenterState, TeamPresenterActions] {
  const [viewModel, setViewModel] = useState<TeamViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [team, setTeam] = useState<(Character | null)[]>([null, null, null, null, null]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getViewModel();
      setViewModel(vm);
      // Initialize team from active team
      if (vm.activeTeam) {
        const newTeam = vm.activeTeam.slots.map((slot) => slot?.character || null);
        while (newTeam.length < 5) newTeam.push(null);
        setTeam(newTeam);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const selectSlot = useCallback((slot: number | null) => {
    setSelectedSlot(slot);
  }, []);

  const addToTeam = useCallback((character: Character) => {
    if (selectedSlot === null) return;
    if (team.some((c) => c?.id === character.id)) return;
    
    const newTeam = [...team];
    newTeam[selectedSlot] = character;
    setTeam(newTeam);
    setSelectedSlot(null);
  }, [selectedSlot, team]);

  const removeFromTeam = useCallback((slot: number) => {
    const newTeam = [...team];
    newTeam[slot] = null;
    setTeam(newTeam);
  }, [team]);

  const saveTeam = useCallback(async () => {
    if (!viewModel?.activeTeam) return;
    
    setLoading(true);
    try {
      const slots: (TeamSlot | null)[] = team.map((char, i) => 
        char ? { position: i, character: char } : null
      );
      
      await presenter.saveTeam({
        ...viewModel.activeTeam,
        slots,
        totalPower: team.reduce((sum, c) => sum + (c?.power || 0), 0),
      });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save team");
    } finally {
      setLoading(false);
    }
  }, [viewModel, team, loadData]);

  useEffect(() => {
    if (!initialViewModel) loadData();
    else if (initialViewModel.activeTeam) {
      const newTeam = initialViewModel.activeTeam.slots.map((slot) => slot?.character || null);
      while (newTeam.length < 5) newTeam.push(null);
      setTeam(newTeam);
    }
  }, []);

  return [
    { viewModel, loading, error, team, selectedSlot },
    { loadData, selectSlot, addToTeam, removeFromTeam, saveTeam, setError },
  ];
}
