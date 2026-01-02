"use client";

import type { Mail, MailAttachment } from "@/src/application/repositories/IMailRepository";
import { useCallback, useEffect, useState } from "react";
import { MailViewModel } from "./MailPresenter";
import { createClientMailPresenter } from "./MailPresenterClientFactory";

const presenter = createClientMailPresenter();

export interface MailPresenterState {
  viewModel: MailViewModel | null;
  loading: boolean;
  error: string | null;
  selectedMail: Mail | null;
  claimedRewards: MailAttachment[] | null;
}

export interface MailPresenterActions {
  loadData: () => Promise<void>;
  selectMail: (mail: Mail | null) => void;
  claimAttachments: (id: string) => Promise<void>;
  claimAll: () => Promise<void>;
  setError: (error: string | null) => void;
  clearRewards: () => void;
}

export function useMailPresenter(
  initialViewModel?: MailViewModel
): [MailPresenterState, MailPresenterActions] {
  const [viewModel, setViewModel] = useState<MailViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [claimedRewards, setClaimedRewards] = useState<MailAttachment[] | null>(null);

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

  const selectMail = useCallback(async (mail: Mail | null) => {
    setSelectedMail(mail);
    if (mail && !mail.read) {
      await presenter.markAsRead(mail.id);
      await loadData();
    }
  }, [loadData]);

  const claimAttachments = useCallback(async (id: string) => {
    try {
      const rewards = await presenter.claimAttachments(id);
      setClaimedRewards(rewards);
      await loadData();
      setSelectedMail(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim");
    }
  }, [loadData]);

  const claimAll = useCallback(async () => {
    try {
      const rewards = await presenter.claimAll();
      if (rewards.length > 0) {
        setClaimedRewards(rewards);
      }
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim");
    }
  }, [loadData]);

  const clearRewards = useCallback(() => setClaimedRewards(null), []);

  useEffect(() => { if (!initialViewModel) loadData(); }, []);

  return [
    { viewModel, loading, error, selectedMail, claimedRewards },
    { loadData, selectMail, claimAttachments, claimAll, setError, clearRewards },
  ];
}
