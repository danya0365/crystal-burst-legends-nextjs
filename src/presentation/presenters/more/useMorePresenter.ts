"use client";

/**
 * useMorePresenter
 * Custom hook for More page state management with react-spring staggered animations
 */

import { useCallback, useEffect, useState } from "react";
import { config, useSpring, useSprings } from "react-spring";
import type { MoreViewModel } from "./MorePresenter";
import { createClientMorePresenter } from "./MorePresenterClientFactory";

export interface UseMorePresenterResult {
  viewModel: MoreViewModel | null;
  isLoading: boolean;
  error: string | null;
  // Animation springs
  headerSpring: ReturnType<typeof useSpring>[0];
  cardSprings: ReturnType<typeof useSprings>[0];
  refresh: () => Promise<void>;
}

export function useMorePresenter(
  initialViewModel?: MoreViewModel
): UseMorePresenterResult {
  const [viewModel, setViewModel] = useState<MoreViewModel | null>(
    initialViewModel ?? null
  );
  const [isLoading, setIsLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Header entrance animation
  const headerSpring = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0px)" : "translateY(-20px)",
    },
    config: config.gentle,
  });

  // Menu cards staggered animation
  const cardSprings = useSprings(
    viewModel?.menuItems.length ?? 10,
    (viewModel?.menuItems ?? Array(10).fill(null)).map((_, index) => ({
      from: { opacity: 0, transform: "translateY(20px) scale(0.95)" },
      to: {
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0px) scale(1)"
          : "translateY(20px) scale(0.95)",
      },
      config: config.gentle,
      delay: 100 + index * 50,
    }))
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const presenter = createClientMorePresenter();
      const data = await presenter.getViewModel();
      setViewModel(data);
      setTimeout(() => setIsVisible(true), 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load menu");
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
    headerSpring,
    cardSprings,
    refresh: fetchData,
  };
}
