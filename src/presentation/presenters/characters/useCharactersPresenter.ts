"use client";

import type { Character, CharacterFilter } from "@/src/application/repositories/ICharacterRepository";
import { useCallback, useEffect, useState } from "react";
import { CharactersViewModel } from "./CharactersPresenter";
import { createClientCharactersPresenter } from "./CharactersPresenterClientFactory";

const presenter = createClientCharactersPresenter();

export interface CharactersPresenterState {
  viewModel: CharactersViewModel | null;
  loading: boolean;
  error: string | null;
  selectedCharacter: Character | null;
  filter: CharacterFilter;
}

export interface CharactersPresenterActions {
  loadData: () => Promise<void>;
  selectCharacter: (character: Character | null) => void;
  setFilter: (filter: CharacterFilter) => void;
  levelUp: (id: string) => Promise<void>;
  evolve: (id: string) => Promise<void>;
  unlock: (id: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export function useCharactersPresenter(
  initialViewModel?: CharactersViewModel
): [CharactersPresenterState, CharactersPresenterActions] {
  const [viewModel, setViewModel] = useState<CharactersViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [filter, setFilterState] = useState<CharacterFilter>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const newViewModel = await presenter.getViewModel(filter);
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const selectCharacter = useCallback((character: Character | null) => {
    setSelectedCharacter(character);
  }, []);

  const setFilter = useCallback((newFilter: CharacterFilter) => {
    setFilterState(newFilter);
  }, []);

  const levelUp = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const updated = await presenter.levelUp(id);
      if (selectedCharacter?.id === id) {
        setSelectedCharacter(updated);
      }
      await loadData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to level up";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadData, selectedCharacter]);

  const evolve = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const updated = await presenter.evolve(id);
      if (selectedCharacter?.id === id) {
        setSelectedCharacter(updated);
      }
      await loadData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to evolve";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadData, selectedCharacter]);

  const unlock = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const updated = await presenter.unlock(id);
      if (selectedCharacter?.id === id) {
        setSelectedCharacter(updated);
      }
      await loadData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to unlock";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadData, selectedCharacter]);

  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [filter]);

  return [
    { viewModel, loading, error, selectedCharacter, filter },
    { loadData, selectCharacter, setFilter, levelUp, evolve, unlock, setError },
  ];
}
