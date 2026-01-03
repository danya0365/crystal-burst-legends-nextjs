/**
 * MockLandingRepository
 * Mock implementation for Landing page content
 */

import {
    ILandingRepository,
    LandingContent,
} from "@/src/application/repositories/ILandingRepository";

const MOCK_LANDING_CONTENT: LandingContent = {
  heroTitle: "Crystal Burst",
  heroSubtitle: "Legends",
  heroDescription: "Embark on an epic adventure, collect legendary heroes, and battle your way to glory!",
  features: [
    { id: "f1", icon: "⚔️", title: "Epic Battles", description: "Strategic turn-based combat system" },
    { id: "f2", icon: "👥", title: "Collect Heroes", description: "Over 50+ unique characters to collect" },
    { id: "f3", icon: "🏆", title: "PVP Arena", description: "Compete against players worldwide" },
    { id: "f4", icon: "📖", title: "Rich Story", description: "Immersive storyline with multiple chapters" },
    { id: "f5", icon: "🎁", title: "Daily Rewards", description: "Login daily for exclusive rewards" },
    { id: "f6", icon: "✨", title: "Gacha System", description: "Exciting summon mechanics" },
  ],
  screenshots: [
    { id: "s1", icon: "🏠", title: "Home Dashboard", description: "Beautiful game hub" },
    { id: "s2", icon: "🎭", title: "Character Collection", description: "Manage your heroes" },
    { id: "s3", icon: "⚔️", title: "Battle System", description: "Strategic combat" },
  ],
  stats: [
    { id: "st1", value: "50+", label: "Characters" },
    { id: "st2", value: "100+", label: "Story Stages" },
    { id: "st3", value: "∞", label: "PVP Battles" },
    { id: "st4", value: "FREE", label: "To Play" },
  ],
  ctaTitle: "Ready to Begin Your Journey?",
  ctaDescription: "Create your profile and start playing now! It's completely free.",
};

export class MockLandingRepository implements ILandingRepository {
  async getContent(): Promise<LandingContent> {
    await this.delay(50);
    return { ...MOCK_LANDING_CONTENT };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockLandingRepository = new MockLandingRepository();
