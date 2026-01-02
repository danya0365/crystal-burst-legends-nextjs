"use client";

import type { SummonBanner, SummonResult } from "@/src/application/repositories/ISummonRepository";
import { useCallback, useEffect, useState } from "react";
import { SummonViewModel } from "./SummonPresenter";
import { createClientSummonPresenter } from "./SummonPresenterClientFactory";

const presenter = createClientSummonPresenter();

export interface SummonPresenterState {
  viewModel: SummonViewModel | null;
  loading: boolean;
  error: string | null;
  summonResult: SummonResult | null;
  isSummoning: boolean;
}

export interface SummonPresenterActions {
  loadData: () => Promise<void>;
  selectBanner: (banner: SummonBanner) => void;
  summonSingle: (bannerId: string) => Promise<void>;
  summonMulti: (bannerId: string) => Promise<void>;
  clearResult: () => void;
  setError: (error: string | null) => void;
}

export function useSummonPresenter(initialViewModel?: SummonViewModel): [SummonPresenterState, SummonPresenterActions] {
  const [viewModel, setViewModel] = useState<SummonViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [summonResult, setSummonResult] = useState<SummonResult | null>(null);
  const [isSummoning, setIsSummoning] = useState(false);

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

  const selectBanner = useCallback((banner: SummonBanner) => {
    if (viewModel) {
      setViewModel({ ...viewModel, selectedBanner: banner });
    }
  }, [viewModel]);

  const summonSingle = useCallback(async (bannerId: string) => {
    setIsSummoning(true);
    try {
      const result = await presenter.summonSingle(bannerId);
      setSummonResult(result);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Summon failed");
    } finally {
      setIsSummoning(false);
    }
  }, [loadData]);

  const summonMulti = useCallback(async (bannerId: string) => {
    setIsSummoning(true);
    try {
      const result = await presenter.summonMulti(bannerId);
      setSummonResult(result);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Summon failed");
    } finally {
      setIsSummoning(false);
    }
  }, [loadData]);

  const clearResult = useCallback(() => setSummonResult(null), []);

  useEffect(() => {
    if (!initialViewModel) loadData();
  }, []);

  return [
    { viewModel, loading, error, summonResult, isSummoning },
    { loadData, selectBanner, summonSingle, summonMulti, clearResult, setError },
  ];
}
