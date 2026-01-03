"use client";

/**
 * useHomePresenter
 * Custom hook for Home page state management with react-spring animations
 */

import { useCallback, useEffect, useState } from "react";
import { config, useSpring, useSprings } from "react-spring";
import type { HomeViewModel } from "./HomePresenter";
import { createClientHomePresenter } from "./HomePresenterClientFactory";

export interface UseHomePresenterResult {
  viewModel: HomeViewModel | null;
  isLoading: boolean;
  error: string | null;
  // Animation springs
  heroSpring: ReturnType<typeof useSpring>[0];
  actionSprings: ReturnType<typeof useSprings>[0];
  refresh: () => Promise<void>;
}

export function useHomePresenter(
  initialViewModel?: HomeViewModel
): UseHomePresenterResult {
  const [viewModel, setViewModel] = useState<HomeViewModel | null>(
    initialViewModel ?? null
  );
  const [isLoading, setIsLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Hero entrance animation
  const heroSpring = useSpring({
    from: { opacity: 0, transform: "translateY(-30px)" },
    to: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0px)" : "translateY(-30px)",
    },
    config: config.gentle,
    delay: 100,
  });

  // Quick action buttons staggered animation
  const actionSprings = useSprings(
    viewModel?.quickActions.length ?? 3,
    (viewModel?.quickActions ?? [1, 2, 3]).map((_, index) => ({
      from: { opacity: 0, transform: "scale(0.8)" },
      to: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0.8)",
      },
      config: config.wobbly,
      delay: 300 + index * 100,
    }))
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const presenter = createClientHomePresenter();
      const data = await presenter.getViewModel();
      setViewModel(data);
      // Trigger animations after data load
      setTimeout(() => setIsVisible(true), 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load home content");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialViewModel) {
      setIsVisible(true);
    } else {
      fetchData();
    }
  }, [initialViewModel, fetchData]);

  return {
    viewModel,
    isLoading,
    error,
    heroSpring,
    actionSprings,
    refresh: fetchData,
  };
}
