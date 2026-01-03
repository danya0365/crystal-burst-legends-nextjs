"use client";

import { useProfileStore } from "@/src/infrastructure/stores/useProfileStore";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface MenuItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

const menuItems: MenuItem[] = [
  { id: "profile", label: "Profile", description: "View your stats and info", icon: "👤", href: "/game/profile", color: "from-indigo-500 to-purple-600" },
  { id: "mail", label: "Mail", description: "Check your inbox", icon: "📬", href: "/game/mail", color: "from-red-500 to-pink-600" },
  { id: "missions", label: "Missions", description: "Complete daily & weekly missions", icon: "📋", href: "/game/missions", color: "from-green-500 to-emerald-600" },
  { id: "team", label: "Team Formation", description: "Organize your battle team", icon: "👥", href: "/game/team", color: "from-blue-500 to-cyan-600" },
  { id: "inventory", label: "Inventory", description: "View your items and equipment", icon: "🎒", href: "/game/inventory", color: "from-orange-500 to-amber-600" },
  { id: "achievements", label: "Achievements", description: "Track your progress", icon: "🏆", href: "/game/achievements", color: "from-yellow-500 to-orange-600" },
  { id: "events", label: "Events", description: "Limited time events", icon: "🎉", href: "/game/events", color: "from-pink-500 to-rose-600" },
  { id: "settings", label: "Settings", description: "Game settings and options", icon: "⚙️", href: "/game/settings", color: "from-gray-500 to-slate-600" },
  { id: "support", label: "Support", description: "Help and customer support", icon: "💬", href: "/game/support", color: "from-purple-500 to-violet-600" },
  { id: "social", label: "Friends", description: "Connect with friends", icon: "👫", href: "/game/social", color: "from-cyan-500 to-teal-600" },
];

export function MoreView() {
  const router = useRouter();
  const { logout, getActiveProfile } = useProfileStore();
  const activeProfile = getActiveProfile();

  const handleReturnToTitle = () => {
    logout();
    router.push("/");
  };

  const handleSwitchProfile = () => {
    router.push("/profiles");
  };

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={8} />

        {/* Header */}
        <div className="relative z-10 p-4 border-b border-[var(--border-color)]">
          <h1 className="text-2xl font-bold text-gradient-primary">More</h1>
          <p className="text-sm text-[var(--text-secondary)]">Additional features and settings</p>
        </div>

        {/* Menu Grid */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4">
          {/* Current Profile */}
          {activeProfile && (
            <div className="game-card p-4 mb-4 flex items-center gap-3">
              <span className="text-3xl">{activeProfile.avatar}</span>
              <div className="flex-1">
                <p className="font-bold text-[var(--text-primary)]">{activeProfile.name}</p>
                <p className="text-xs text-[var(--text-muted)]">Playing as</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {menuItems.map((item) => (
              <Link key={item.id} href={item.href}>
                <div className={`game-card p-4 h-full hover:scale-105 transition-transform cursor-pointer`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <h3 className="font-bold text-[var(--text-primary)]">{item.label}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Account Actions */}
          <div className="mt-6 space-y-3">
            <GameButton variant="secondary" fullWidth onClick={handleSwitchProfile} icon="🔄">
              Switch Profile
            </GameButton>
            <GameButton variant="ghost" fullWidth onClick={handleReturnToTitle} icon="🏠">
              Return to Title
            </GameButton>
          </div>

          {/* Game Info */}
          <div className="mt-6 game-card p-4 text-center">
            <p className="text-[var(--text-muted)] text-sm">Crystal Burst Legends</p>
            <p className="text-xs text-[var(--text-muted)]">Version 1.0.0</p>
            <div className="flex justify-center gap-4 mt-3">
              <Link href="/terms" className="text-xs text-[var(--color-primary)]">Terms of Service</Link>
              <Link href="/privacy" className="text-xs text-[var(--color-primary)]">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
