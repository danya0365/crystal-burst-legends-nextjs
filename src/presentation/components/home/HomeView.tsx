"use client";

/**
 * HomeView
 * Main game home screen with crystal bubble effects, react-spring animations, and quick actions
 */

import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import type { HomeViewModel } from "@/src/presentation/presenters/home/HomePresenter";
import { useHomePresenter } from "@/src/presentation/presenters/home/useHomePresenter";
import Link from "next/link";
import { animated } from "react-spring";

interface HomeViewProps {
  initialViewModel?: HomeViewModel;
}

export function HomeView({ initialViewModel }: HomeViewProps) {
  const { viewModel, isLoading, heroSpring, actionSprings } =
    useHomePresenter(initialViewModel);

  if (isLoading || !viewModel) {
    return (
      <MainLayout>
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl animate-pulse mb-4">🔮</div>
            <p className="text-[var(--text-secondary)]">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
        {/* Background Crystal Bubbles */}
        <CrystalBubbleAnimation count={20} />

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-4">
          {/* Game Title with Animation */}
          <animated.div style={heroSpring} className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gradient-primary mb-2">
              {viewModel.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-[var(--text-secondary)]">
              {viewModel.hero.subtitle}
            </p>
          </animated.div>

          {/* Featured Character Placeholder with Animation */}
          <animated.div
            style={heroSpring}
            className="relative w-64 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden glass-effect"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 flex items-center justify-center">
              <span className="text-8xl opacity-50">
                {viewModel.hero.featuredCharacter.emoji}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-lg font-bold text-white">
                {viewModel.hero.featuredCharacter.name}
              </p>
              <p className="text-sm text-[var(--color-secondary)]">
                {viewModel.hero.featuredCharacter.description}
              </p>
            </div>
          </animated.div>

          {/* Quick Action Buttons with Staggered Animation */}
          <div className="flex flex-wrap justify-center gap-4">
            {viewModel.quickActions.map((action, index) => (
              <animated.div
                key={action.id}
                style={actionSprings[index]}
              >
                <Link href={action.href}>
                  <GameButton
                    variant={action.variant}
                    size="lg"
                    icon={action.icon}
                  >
                    {action.label}
                  </GameButton>
                </Link>
              </animated.div>
            ))}
          </div>

          {/* News/Announcements */}
          {viewModel.news.map((newsItem) => (
            <animated.div
              key={newsItem.id}
              style={heroSpring}
              className="game-card w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  {newsItem.title}
                </h3>
                {newsItem.isNew && (
                  <span className="text-xs text-[var(--color-primary)]">NEW</span>
                )}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                {newsItem.content}
              </p>
            </animated.div>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-4 w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
        <div className="absolute bottom-1/3 right-8 w-3 h-3 rounded-full bg-[var(--color-secondary)] animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 rounded-full bg-[var(--color-accent-purple)] animate-pulse" />
      </div>
    </MainLayout>
  );
}
