"use client";

import type { AchievementCategory } from "@/src/application/repositories/IAchievementRepository";
import { useCallback, useEffect, useState } from "react";
import { AchievementsViewModel } from "./AchievementsPresenter";
import { createClientAchievementsPresenter } from "./AchievementsPresenterClientFactory";

const presenter = createClientAchievementsPresenter();

export interface AchievementsPresenterState {
  viewModel: AchievementsViewModel | null;
  loading: boolean;
  error: string | null;
  selectedCategory: AchievementCategory | "all";
}

export interface AchievementsPresenterActions {
  loadData: () => Promise<void>;
  setCategory: (category: AchievementCategory | "all") => void;
  claimAchievement: (id: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export function useAchievementsPresenter(
  initialViewModel?: AchievementsViewModel
): [AchievementsPresenterState, AchievementsPresenterActions] {
  const [viewModel, setViewModel] = useState<AchievementsViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | "all">("all");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getViewModel(selectedCategory);
      setViewModel(vm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  const setCategory = useCallback((category: AchievementCategory | "all") => {
    setSelectedCategory(category);
  }, []);

  const claimAchievement = useCallback(async (id: string) => {
    try {
      await presenter.claim(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim");
    }
  }, [loadData]);

  useEffect(() => { loadData(); }, [selectedCategory]);

  return [
    { viewModel, loading, error, selectedCategory },
    { loadData, setCategory, claimAchievement, setError },
  ];
}
