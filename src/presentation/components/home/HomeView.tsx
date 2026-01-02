"use client";

import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import Link from "next/link";

/**
 * HomeView
 * Main game home screen with crystal bubble effects and quick actions
 */
export function HomeView() {
  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
        {/* Background Crystal Bubbles */}
        <CrystalBubbleAnimation count={20} />

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-4">
          {/* Game Title */}
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gradient-primary mb-2">
              Crystal Burst
            </h1>
            <p className="text-xl md:text-2xl text-[var(--text-secondary)]">
              Legends
            </p>
          </div>

          {/* Featured Character Placeholder */}
          <div className="relative w-64 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden glass-effect">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 flex items-center justify-center">
              <span className="text-8xl opacity-50">🔮</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-lg font-bold text-white">Featured Character</p>
              <p className="text-sm text-[var(--color-secondary)]">Coming Soon</p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/story">
              <GameButton variant="primary" size="lg" icon="📖">
                Story Mode
              </GameButton>
            </Link>
            <Link href="/pvp">
              <GameButton variant="secondary" size="lg" icon="⚔️">
                PVP Battle
              </GameButton>
            </Link>
            <Link href="/summon">
              <GameButton variant="ghost" size="lg" icon="✨">
                Summon
              </GameButton>
            </Link>
          </div>

          {/* News/Announcements */}
          <div className="game-card w-full max-w-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">📢 News</h3>
              <span className="text-xs text-[var(--color-primary)]">NEW</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              Welcome to Crystal Burst Legends! Start your journey and collect powerful characters.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-4 w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
        <div className="absolute bottom-1/3 right-8 w-3 h-3 rounded-full bg-[var(--color-secondary)] animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 rounded-full bg-[var(--color-accent-purple)] animate-pulse" />
      </div>
    </MainLayout>
  );
}
