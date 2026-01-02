"use client";

import type { SettingSection } from "@/src/application/repositories/ISettingsRepository";
import { useCallback, useEffect, useState } from "react";
import { SettingsViewModel } from "./SettingsPresenter";
import { createClientSettingsPresenter } from "./SettingsPresenterClientFactory";

const presenter = createClientSettingsPresenter();

export interface SettingsPresenterState {
  viewModel: SettingsViewModel | null;
  loading: boolean;
  error: string | null;
  selectedSection: SettingSection;
}

export interface SettingsPresenterActions {
  loadData: () => Promise<void>;
  setSection: (section: SettingSection) => void;
  updateSetting: (id: string, value: boolean | string | number) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  setError: (error: string | null) => void;
}

export function useSettingsPresenter(
  initialViewModel?: SettingsViewModel
): [SettingsPresenterState, SettingsPresenterActions] {
  const [viewModel, setViewModel] = useState<SettingsViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<SettingSection>(initialViewModel?.selectedSection || "general");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getViewModel(selectedSection);
      setViewModel(vm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [selectedSection]);

  const setSection = useCallback((section: SettingSection) => {
    setSelectedSection(section);
  }, []);

  const updateSetting = useCallback(async (id: string, value: boolean | string | number) => {
    try {
      await presenter.updateSetting(id, value);
      // Update local state
      if (viewModel) {
        const updatedItems = viewModel.sectionItems.map((item) =>
          item.id === id ? { ...item, value } : item
        );
        setViewModel({ ...viewModel, sectionItems: updatedItems });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update setting");
    }
  }, [viewModel]);

  const resetToDefaults = useCallback(async () => {
    setLoading(true);
    try {
      await presenter.resetToDefaults();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset settings");
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [selectedSection]);

  return [
    { viewModel, loading, error, selectedSection },
    { loadData, setSection, updateSetting, resetToDefaults, setError },
  ];
}
