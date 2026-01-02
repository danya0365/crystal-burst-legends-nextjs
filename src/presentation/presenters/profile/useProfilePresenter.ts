"use client";

import { useCallback, useEffect, useState } from "react";
import { ProfileViewModel } from "./ProfilePresenter";
import { createClientProfilePresenter } from "./ProfilePresenterClientFactory";

const presenter = createClientProfilePresenter();

export interface ProfilePresenterState {
  viewModel: ProfileViewModel | null;
  loading: boolean;
  error: string | null;
  editing: boolean;
}

export interface ProfilePresenterActions {
  loadData: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
  updateAvatar: (avatar: string) => Promise<void>;
  setEditing: (editing: boolean) => void;
  setError: (error: string | null) => void;
}

export function useProfilePresenter(
  initialViewModel?: ProfileViewModel
): [ProfilePresenterState, ProfilePresenterActions] {
  const [viewModel, setViewModel] = useState<ProfileViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getViewModel();
      setViewModel(vm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateName = useCallback(async (name: string) => {
    try {
      await presenter.updateName(name);
      await loadData();
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update name");
    }
  }, [loadData]);

  const updateAvatar = useCallback(async (avatar: string) => {
    try {
      await presenter.updateAvatar(avatar);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update avatar");
    }
  }, [loadData]);

  useEffect(() => { if (!initialViewModel) loadData(); }, []);

  return [
    { viewModel, loading, error, editing },
    { loadData, updateName, updateAvatar, setEditing, setError },
  ];
}
