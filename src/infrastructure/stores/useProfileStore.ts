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
  profiles: PlayerProfile[];
  activeProfileId: string | null;
  
  // Getters
  getActiveProfile: () => PlayerProfile | null;
  hasProfiles: () => boolean;
  
  // Actions
  createProfile: (name: string, avatar: string) => PlayerProfile;
  switchProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  updateProfile: (id: string, updates: Partial<PlayerProfile>) => void;
  logout: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,
      
      getActiveProfile: () => {
        const { profiles, activeProfileId } = get();
        return profiles.find((p) => p.id === activeProfileId) || null;
      },
      
      hasProfiles: () => get().profiles.length > 0,
      
      createProfile: (name, avatar) => {
        const newProfile: PlayerProfile = {
          id: `profile_${Date.now()}`,
          name,
          avatar,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          profiles: [...state.profiles, newProfile],
          activeProfileId: newProfile.id,
        }));
        return newProfile;
      },
      
      switchProfile: (id) => {
        const { profiles } = get();
        if (profiles.some((p) => p.id === id)) {
          set({ activeProfileId: id });
        }
      },
      
      deleteProfile: (id) => {
        set((state) => {
          const newProfiles = state.profiles.filter((p) => p.id !== id);
          const newActiveId = state.activeProfileId === id 
            ? (newProfiles[0]?.id || null) 
            : state.activeProfileId;
          return { profiles: newProfiles, activeProfileId: newActiveId };
        });
      },
      
      updateProfile: (id, updates) => {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },
      
      logout: () => {
        set({ activeProfileId: null });
      },
    }),
    {
      name: "crystal-burst-profiles",
    }
  )
);
