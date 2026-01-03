"use client";

import { useEffect, useState } from "react";
import { ContactViewModel, PrivacyViewModel, TermsViewModel } from "./LegalPresenter";
import { createClientLegalPresenter } from "./LegalPresenterClientFactory";

const presenter = createClientLegalPresenter();

export interface TermsPresenterState {
  viewModel: TermsViewModel | null;
  loading: boolean;
  error: string | null;
}

export interface PrivacyPresenterState {
  viewModel: PrivacyViewModel | null;
  loading: boolean;
  error: string | null;
}

export interface ContactPresenterState {
  viewModel: ContactViewModel | null;
  loading: boolean;
  error: string | null;
}

export function useTermsPresenter(
  initialViewModel?: TermsViewModel
): TermsPresenterState {
  const [viewModel, setViewModel] = useState<TermsViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getTermsViewModel();
      setViewModel(vm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { viewModel, loading, error };
}

export function usePrivacyPresenter(
  initialViewModel?: PrivacyViewModel
): PrivacyPresenterState {
  const [viewModel, setViewModel] = useState<PrivacyViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getPrivacyViewModel();
      setViewModel(vm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { viewModel, loading, error };
}

export function useContactPresenter(
  initialViewModel?: ContactViewModel
): ContactPresenterState {
  const [viewModel, setViewModel] = useState<ContactViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const vm = await presenter.getContactViewModel();
      setViewModel(vm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { viewModel, loading, error };
}
