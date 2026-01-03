/**
 * ProfilesPresenter
 * Handles business logic for Profiles page
 * Note: Profiles uses Zustand store directly, but we still follow the pattern structure
 */

import { Metadata } from "next";

export interface ProfilesViewModel {
  avatars: string[];
}

export class ProfilesPresenter {
  async getViewModel(): Promise<ProfilesViewModel> {
    return {
      avatars: ["🎮", "👑", "🔥", "⚡", "🌟", "💎", "🐉", "🦁", "🎯", "🏆", "⚔️", "🛡️"],
    };
  }

  generateMetadata(): Metadata {
    return {
      title: "Select Profile | Crystal Burst Legends",
      description: "Choose or create your player profile",
    };
  }
}
