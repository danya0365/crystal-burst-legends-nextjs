"use client";

import type { PvpMatch } from "@/src/application/repositories/IPvpRepository";
import { useCallback, useEffect, useState } from "react";
import { PvpViewModel } from "./PvpPresenter";
import { createClientPvpPresenter } from "./PvpPresenterClientFactory";

const presenter = createClientPvpPresenter();

export interface PvpPresenterState {
  viewModel: PvpViewModel | null;
  loading: boolean;
  error: string | null;
  battleResult: PvpMatch | null;
}

export interface PvpPresenterActions {
  loadData: () => Promise<void>;
  findOpponents: () => Promise<void>;
  battle: (matchId: string) => Promise<void>;
  clearBattleResult: () => void;
  setError: (error: string | null) => void;
}

export function usePvpPresenter(initialViewModel?: PvpViewModel): [PvpPresenterState, PvpPresenterActions] {
  const [viewModel, setViewModel] = useState<PvpViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [battleResult, setBattleResult] = useState<PvpMatch | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const vm = await presenter.getViewModel();
      setViewModel(vm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const findOpponents = useCallback(async () => {
    setLoading(true);
    try {
      const opponents = await presenter.findOpponents();
      if (viewModel) setViewModel({ ...viewModel, opponents });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to find opponents");
    } finally {
      setLoading(false);
    }
  }, [viewModel]);

  const battle = useCallback(async (matchId: string) => {
    setLoading(true);
    setBattleResult(null);
    try {
      const result = await presenter.battle(matchId);
      setBattleResult(result);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Battle failed");
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  const clearBattleResult = useCallback(() => setBattleResult(null), []);

  useEffect(() => {
    if (!initialViewModel) loadData();
  }, []);

  return [
    { viewModel, loading, error, battleResult },
    { loadData, findOpponents, battle, clearBattleResult, setError },
  ];
}
