"use client";

import type { Chapter, Stage } from "@/src/application/repositories/IStoryRepository";
import { useCallback, useEffect, useState } from "react";
import { StoryViewModel } from "./StoryPresenter";
import { createClientStoryPresenter } from "./StoryPresenterClientFactory";

const presenter = createClientStoryPresenter();

export interface StoryPresenterState {
  viewModel: StoryViewModel | null;
  loading: boolean;
  error: string | null;
  selectedChapter: Chapter | null;
  selectedStage: Stage | null;
}

export interface StoryPresenterActions {
  loadData: () => Promise<void>;
  selectChapter: (chapter: Chapter | null) => void;
  selectStage: (stage: Stage | null) => void;
  completeStage: (stageId: string, stars: number) => Promise<void>;
  setError: (error: string | null) => void;
}

export function useStoryPresenter(
  initialViewModel?: StoryViewModel
): [StoryPresenterState, StoryPresenterActions] {
  const [viewModel, setViewModel] = useState<StoryViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);

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

  const selectChapter = useCallback((chapter: Chapter | null) => {
    setSelectedChapter(chapter);
    setSelectedStage(null);
  }, []);

  const selectStage = useCallback((stage: Stage | null) => {
    setSelectedStage(stage);
  }, []);

  const completeStage = useCallback(async (stageId: string, stars: number) => {
    setLoading(true);
    try {
      await presenter.completeStage(stageId, stars);
      await loadData();
      setSelectedStage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete stage");
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  useEffect(() => {
    if (!initialViewModel) loadData();
  }, []);

  return [
    { viewModel, loading, error, selectedChapter, selectedStage },
    { loadData, selectChapter, selectStage, completeStage, setError },
  ];
}
