"use client";

import type { MissionType } from "@/src/application/repositories/IMissionRepository";
import { useCallback, useEffect, useState } from "react";
import { MissionsViewModel } from "./MissionsPresenter";
import { createClientMissionsPresenter } from "./MissionsPresenterClientFactory";

const presenter = createClientMissionsPresenter();

export interface MissionsPresenterState {
  viewModel: MissionsViewModel | null;
  loading: boolean;
  error: string | null;
  selectedType: MissionType;
}

export interface MissionsPresenterActions {
  loadData: () => Promise<void>;
  setType: (type: MissionType) => void;
  claimMission: (id: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export function useMissionsPresenter(
  initialViewModel?: MissionsViewModel
): [MissionsPresenterState, MissionsPresenterActions] {
  const [viewModel, setViewModel] = useState<MissionsViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<MissionType>(initialViewModel?.selectedType || "daily");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getViewModel(selectedType);
      setViewModel(vm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [selectedType]);

  const setType = useCallback((type: MissionType) => {
    setSelectedType(type);
  }, []);

  const claimMission = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await presenter.claimMission(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim mission");
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [selectedType]);

  return [
    { viewModel, loading, error, selectedType },
    { loadData, setType, claimMission, setError },
  ];
}
