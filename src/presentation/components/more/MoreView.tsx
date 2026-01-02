"use client";

import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import Link from "next/link";

interface MenuItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

const menuItems: MenuItem[] = [
  { id: "missions", label: "Missions", description: "Complete daily & weekly missions", icon: "📋", href: "/missions", color: "from-green-500 to-emerald-600" },
  { id: "team", label: "Team Formation", description: "Organize your battle team", icon: "👥", href: "/team", color: "from-blue-500 to-cyan-600" },
  { id: "inventory", label: "Inventory", description: "View your items and equipment", icon: "🎒", href: "/inventory", color: "from-orange-500 to-amber-600" },
  { id: "achievements", label: "Achievements", description: "Track your progress", icon: "🏆", href: "/achievements", color: "from-yellow-500 to-orange-600" },
  { id: "events", label: "Events", description: "Limited time events", icon: "🎉", href: "/events", color: "from-pink-500 to-rose-600" },
  { id: "settings", label: "Settings", description: "Game settings and options", icon: "⚙️", href: "/settings", color: "from-gray-500 to-slate-600" },
  { id: "support", label: "Support", description: "Help and customer support", icon: "💬", href: "/support", color: "from-purple-500 to-violet-600" },
  { id: "social", label: "Friends", description: "Connect with friends", icon: "👫", href: "/social", color: "from-cyan-500 to-teal-600" },
];

export function MoreView() {
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

          {/* Game Info */}
          <div className="mt-6 game-card p-4 text-center">
            <p className="text-[var(--text-muted)] text-sm">Crystal Burst Legends</p>
            <p className="text-xs text-[var(--text-muted)]">Version 1.0.0</p>
            <div className="flex justify-center gap-4 mt-3">
              <a href="#" className="text-xs text-[var(--color-primary)]">Terms of Service</a>
              <a href="#" className="text-xs text-[var(--color-primary)]">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
