"use client";

import { useEffect, useState } from "react";
import { LandingViewModel } from "./LandingPresenter";
import { createClientLandingPresenter } from "./LandingPresenterClientFactory";

const presenter = createClientLandingPresenter();

export interface LandingPresenterState {
  viewModel: LandingViewModel | null;
  loading: boolean;
  error: string | null;
}

export function useLandingPresenter(
  initialViewModel?: LandingViewModel
): LandingPresenterState {
  const [viewModel, setViewModel] = useState<LandingViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const newViewModel = await presenter.getViewModel();
      setViewModel(newViewModel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { viewModel, loading, error };
}
