/**
 * MockMoreRepository
 * Mock implementation of IMoreRepository for development
 */

import type {
    IMoreRepository,
    MoreContent,
} from "@/src/application/repositories/IMoreRepository";

export class MockMoreRepository implements IMoreRepository {
  async getMoreContent(): Promise<MoreContent> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      menuItems: [
        {
          id: "profile",
          label: "Profile",
          description: "View your stats and info",
          icon: "👤",
          href: "/game/profile",
          color: "from-indigo-500 to-purple-600",
        },
        {
          id: "mail",
          label: "Mail",
          description: "Check your inbox",
          icon: "📬",
          href: "/game/mail",
          color: "from-red-500 to-pink-600",
        },
        {
          id: "missions",
          label: "Missions",
          description: "Complete daily & weekly missions",
          icon: "📋",
          href: "/game/missions",
          color: "from-green-500 to-emerald-600",
        },
        {
          id: "team",
          label: "Team Formation",
          description: "Organize your battle team",
          icon: "👥",
          href: "/game/team",
          color: "from-blue-500 to-cyan-600",
        },
        {
          id: "inventory",
          label: "Inventory",
          description: "View your items and equipment",
          icon: "🎒",
          href: "/game/inventory",
          color: "from-orange-500 to-amber-600",
        },
        {
          id: "achievements",
          label: "Achievements",
          description: "Track your progress",
          icon: "🏆",
          href: "/game/achievements",
          color: "from-yellow-500 to-orange-600",
        },
        {
          id: "events",
          label: "Events",
          description: "Limited time events",
          icon: "🎉",
          href: "/game/events",
          color: "from-pink-500 to-rose-600",
        },
        {
          id: "settings",
          label: "Settings",
          description: "Game settings and options",
          icon: "⚙️",
          href: "/game/settings",
          color: "from-gray-500 to-slate-600",
        },
        {
          id: "support",
          label: "Support",
          description: "Help and customer support",
          icon: "💬",
          href: "/game/support",
          color: "from-purple-500 to-violet-600",
        },
        {
          id: "social",
          label: "Friends",
          description: "Connect with friends",
          icon: "👫",
          href: "/game/social",
          color: "from-cyan-500 to-teal-600",
        },
      ],
      gameInfo: {
        name: "Crystal Burst Legends",
        version: "1.0.0",
      },
    };
  }
}
