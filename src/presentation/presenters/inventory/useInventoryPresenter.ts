"use client";

import type { InventoryItem, ItemCategory } from "@/src/application/repositories/IInventoryRepository";
import { useCallback, useEffect, useState } from "react";
import { InventoryViewModel } from "./InventoryPresenter";
import { createClientInventoryPresenter } from "./InventoryPresenterClientFactory";

const presenter = createClientInventoryPresenter();

export interface InventoryPresenterState {
  viewModel: InventoryViewModel | null;
  loading: boolean;
  error: string | null;
  selectedCategory: ItemCategory | "all";
  selectedItem: InventoryItem | null;
}

export interface InventoryPresenterActions {
  loadData: () => Promise<void>;
  setCategory: (category: ItemCategory | "all") => void;
  selectItem: (item: InventoryItem | null) => void;
  useItem: (id: string) => Promise<void>;
  sellItem: (id: string, quantity: number) => Promise<void>;
  setError: (error: string | null) => void;
}

export function useInventoryPresenter(
  initialViewModel?: InventoryViewModel
): [InventoryPresenterState, InventoryPresenterActions] {
  const [viewModel, setViewModel] = useState<InventoryViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | "all">("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

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

  const setCategory = useCallback((category: ItemCategory | "all") => {
    setSelectedCategory(category);
  }, []);

  const selectItem = useCallback((item: InventoryItem | null) => {
    setSelectedItem(item);
  }, []);

  const useItem = useCallback(async (id: string) => {
    try {
      await presenter.useItem(id);
      await loadData();
      setSelectedItem(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to use item");
    }
  }, [loadData]);

  const sellItem = useCallback(async (id: string, quantity: number) => {
    try {
      const result = await presenter.sellItem(id, quantity);
      await loadData();
      setSelectedItem(null);
      // Could show coins earned
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sell item");
    }
  }, [loadData]);

  useEffect(() => { loadData(); }, [selectedCategory]);

  return [
    { viewModel, loading, error, selectedCategory, selectedItem },
    { loadData, setCategory, selectItem, useItem, sellItem, setError },
  ];
}
