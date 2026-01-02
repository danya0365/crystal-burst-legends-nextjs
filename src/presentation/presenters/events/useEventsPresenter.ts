"use client";

import type { GameEvent } from "@/src/application/repositories/IEventRepository";
import { useCallback, useEffect, useState } from "react";
import { EventsViewModel } from "./EventsPresenter";
import { createClientEventsPresenter } from "./EventsPresenterClientFactory";

const presenter = createClientEventsPresenter();

export interface EventsPresenterState {
  viewModel: EventsViewModel | null;
  loading: boolean;
  error: string | null;
  selectedEvent: GameEvent | null;
}

export interface EventsPresenterActions {
  loadData: () => Promise<void>;
  selectEvent: (event: GameEvent | null) => void;
  claimReward: (eventId: string, rewardIndex: number) => Promise<void>;
  setError: (error: string | null) => void;
}

export function useEventsPresenter(
  initialViewModel?: EventsViewModel
): [EventsPresenterState, EventsPresenterActions] {
  const [viewModel, setViewModel] = useState<EventsViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null);

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

  const selectEvent = useCallback((event: GameEvent | null) => {
    setSelectedEvent(event);
  }, []);

  const claimReward = useCallback(async (eventId: string, rewardIndex: number) => {
    try {
      await presenter.claimReward(eventId, rewardIndex);
      await loadData();
      // Refresh selected event
      if (selectedEvent?.id === eventId) {
        const vm = await presenter.getViewModel();
        const updated = vm.events.find((e) => e.id === eventId);
        if (updated) setSelectedEvent(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim");
    }
  }, [loadData, selectedEvent]);

  useEffect(() => { if (!initialViewModel) loadData(); }, []);

  return [
    { viewModel, loading, error, selectedEvent },
    { loadData, selectEvent, claimReward, setError },
  ];
}
