"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
}

interface ProfileState {
  profile: PlayerProfile | null;
  hasProfile: boolean;
  createProfile: (name: string, avatar: string) => void;
  updateProfile: (updates: Partial<PlayerProfile>) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      hasProfile: false,
      createProfile: (name, avatar) => {
        const profile: PlayerProfile = {
          id: `player_${Date.now()}`,
          name,
          avatar,
          createdAt: new Date().toISOString(),
        };
        set({ profile, hasProfile: true });
      },
      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),
      clearProfile: () => set({ profile: null, hasProfile: false }),
    }),
    {
      name: "crystal-burst-profile",
    }
  )
);
