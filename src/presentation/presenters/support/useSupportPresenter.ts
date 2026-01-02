"use client";

import { useCallback, useEffect, useState } from "react";
import { SupportViewModel } from "./SupportPresenter";
import { createClientSupportPresenter } from "./SupportPresenterClientFactory";

const presenter = createClientSupportPresenter();

export interface SupportPresenterState {
  viewModel: SupportViewModel | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

export interface SupportPresenterActions {
  loadData: () => Promise<void>;
  createTicket: (subject: string, message: string) => Promise<void>;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

export function useSupportPresenter(
  initialViewModel?: SupportViewModel
): [SupportPresenterState, SupportPresenterActions] {
  const [viewModel, setViewModel] = useState<SupportViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const createTicket = useCallback(async (subject: string, message: string) => {
    setLoading(true);
    try {
      await presenter.createTicket(subject, message);
      setSuccess("Ticket submitted successfully!");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit ticket");
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  useEffect(() => { if (!initialViewModel) loadData(); }, []);

  return [
    { viewModel, loading, error, success },
    { loadData, createTicket, setError, setSuccess },
  ];
}
