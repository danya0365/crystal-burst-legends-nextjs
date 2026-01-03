"use client";

import { GachaBanner, GachaPullResult } from "@/src/application/repositories/IGachaRepository";
import { useCallback, useEffect, useState } from "react";
import { GachaViewModel } from "./GachaPresenter";
import { createClientGachaPresenter } from "./GachaPresenterClientFactory";

const presenter = createClientGachaPresenter();

export interface GachaPresenterState {
  viewModel: GachaViewModel | null;
  loading: boolean;
  error: string | null;
  isPulling: boolean;
  pullResults: GachaPullResult[];
  showResults: boolean;
  selectedBanner: GachaBanner | null;
}

export interface GachaPresenterActions {
  loadData: () => Promise<void>;
  selectBanner: (banner: GachaBanner) => void;
  pullSingle: () => Promise<void>;
  pullMulti: () => Promise<void>;
  closeResults: () => void;
}

export function useGachaPresenter(
  initialViewModel?: GachaViewModel
): [GachaPresenterState, GachaPresenterActions] {
  const [viewModel, setViewModel] = useState<GachaViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [pullResults, setPullResults] = useState<GachaPullResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<GachaBanner | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getViewModel();
      setViewModel(vm);
      if (!selectedBanner && vm.banners.length > 0) {
        setSelectedBanner(vm.banners[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [selectedBanner]);

  const selectBanner = useCallback((banner: GachaBanner) => {
    setSelectedBanner(banner);
  }, []);

  const pullSingle = useCallback(async () => {
    if (!selectedBanner) return;
    setIsPulling(true);
    setError(null);
    try {
      const result = await presenter.pullSingle(selectedBanner.id);
      setPullResults([result]);
      setShowResults(true);
      await loadData(); // Refresh crystals
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pull failed");
    } finally {
      setIsPulling(false);
    }
  }, [selectedBanner, loadData]);

  const pullMulti = useCallback(async () => {
    if (!selectedBanner) return;
    setIsPulling(true);
    setError(null);
    try {
      const results = await presenter.pullMulti(selectedBanner.id);
      setPullResults(results);
      setShowResults(true);
      await loadData(); // Refresh crystals
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pull failed");
    } finally {
      setIsPulling(false);
    }
  }, [selectedBanner, loadData]);

  const closeResults = useCallback(() => {
    setShowResults(false);
    setPullResults([]);
  }, []);

  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    } else if (!selectedBanner && initialViewModel.banners.length > 0) {
      setSelectedBanner(initialViewModel.banners[0]);
    }
  }, []);

  return [
    { viewModel, loading, error, isPulling, pullResults, showResults, selectedBanner },
    { loadData, selectBanner, pullSingle, pullMulti, closeResults },
  ];
}
