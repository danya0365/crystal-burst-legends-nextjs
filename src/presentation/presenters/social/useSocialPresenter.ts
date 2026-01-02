"use client";

import type { Friend } from "@/src/application/repositories/ISocialRepository";
import { useCallback, useEffect, useState } from "react";
import { SocialViewModel } from "./SocialPresenter";
import { createClientSocialPresenter } from "./SocialPresenterClientFactory";

const presenter = createClientSocialPresenter();

export interface SocialPresenterState {
  viewModel: SocialViewModel | null;
  loading: boolean;
  error: string | null;
  searchResults: Friend[];
  searchQuery: string;
}

export interface SocialPresenterActions {
  loadData: () => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  search: (query: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export function useSocialPresenter(
  initialViewModel?: SocialViewModel
): [SocialPresenterState, SocialPresenterActions] {
  const [viewModel, setViewModel] = useState<SocialViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const acceptRequest = useCallback(async (requestId: string) => {
    try {
      await presenter.acceptRequest(requestId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }, [loadData]);

  const rejectRequest = useCallback(async (requestId: string) => {
    try {
      await presenter.rejectRequest(requestId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }, [loadData]);

  const removeFriend = useCallback(async (friendId: string) => {
    try {
      await presenter.removeFriend(friendId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }, [loadData]);

  const search = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await presenter.searchPlayers(query);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    }
  }, []);

  useEffect(() => { if (!initialViewModel) loadData(); }, []);

  return [
    { viewModel, loading, error, searchResults, searchQuery },
    { loadData, acceptRequest, rejectRequest, removeFriend, search, setError },
  ];
}
