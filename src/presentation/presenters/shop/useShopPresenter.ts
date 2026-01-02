"use client";

import type { ShopCategory } from "@/src/application/repositories/IShopRepository";
import { useCallback, useEffect, useState } from "react";
import { ShopViewModel } from "./ShopPresenter";
import { createClientShopPresenter } from "./ShopPresenterClientFactory";

const presenter = createClientShopPresenter();

export interface ShopPresenterState {
  viewModel: ShopViewModel | null;
  loading: boolean;
  error: string | null;
  selectedCategory: ShopCategory;
}

export interface ShopPresenterActions {
  loadData: () => Promise<void>;
  setCategory: (category: ShopCategory) => void;
  purchase: (itemId: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export function useShopPresenter(initialViewModel?: ShopViewModel): [ShopPresenterState, ShopPresenterActions] {
  const [viewModel, setViewModel] = useState<ShopViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>("crystals");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const vm = await presenter.getViewModel(selectedCategory);
      setViewModel(vm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  const setCategory = useCallback((category: ShopCategory) => {
    setSelectedCategory(category);
  }, []);

  const purchase = useCallback(async (itemId: string) => {
    setLoading(true);
    try {
      await presenter.purchase(itemId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed");
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  return [
    { viewModel, loading, error, selectedCategory },
    { loadData, setCategory, purchase, setError },
  ];
}
