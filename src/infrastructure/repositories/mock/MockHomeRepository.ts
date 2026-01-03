/**
 * MockHomeRepository
 * Mock implementation of IHomeRepository for development
 */

import type {
    HomeContent,
    IHomeRepository,
} from "@/src/application/repositories/IHomeRepository";

export class MockHomeRepository implements IHomeRepository {
  async getHomeContent(): Promise<HomeContent> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      hero: {
        title: "Crystal Burst",
        subtitle: "Legends",
        featuredCharacter: {
          name: "Featured Character",
          description: "Coming Soon",
          emoji: "🔮",
        },
      },
      quickActions: [
        {
          id: "story",
          label: "Story Mode",
          href: "/game/story",
          icon: "📖",
          variant: "primary",
        },
        {
          id: "pvp",
          label: "PVP Battle",
          href: "/game/pvp",
          icon: "⚔️",
          variant: "secondary",
        },
        {
          id: "summon",
          label: "Summon",
          href: "/game/summon",
          icon: "✨",
          variant: "ghost",
        },
      ],
      news: [
        {
          id: "welcome",
          title: "📢 News",
          content:
            "Welcome to Crystal Burst Legends! Start your journey and collect powerful characters.",
          isNew: true,
          createdAt: new Date(),
        },
      ],
    };
  }
}
