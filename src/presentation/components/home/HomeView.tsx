"use client";

/**
 * HomeView
 * Main game home screen with 3D Crystal Field scene using Kenney models
 */

import { GameButton } from "@/src/presentation/components/common/GameButton";
import { SceneDisplay, SceneSwitcher, type SceneType } from "@/src/presentation/components/effects/SceneSelector";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import type { HomeViewModel } from "@/src/presentation/presenters/home/HomePresenter";
import { useHomePresenter } from "@/src/presentation/presenters/home/useHomePresenter";
import Link from "next/link";
import { useState } from "react";
import { animated } from "react-spring";

interface HomeViewProps {
  initialViewModel?: HomeViewModel;
}

export function HomeView({ initialViewModel }: HomeViewProps) {
  const { viewModel, isLoading, heroSpring, actionSprings } =
    useHomePresenter(initialViewModel);
    
  // Manage scene state here to allow placing the switcher in a safe UI layer
  const [currentScene, setCurrentScene] = useState<SceneType>("industrial-city");

  if (isLoading || !viewModel) {
    return (
      <MainLayout>
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#1a0a2e] to-[#2d1b4e]">
          <div className="text-center">
            <div className="text-6xl animate-pulse mb-4">💎</div>
            <p className="text-purple-300">Loading Crystal Field...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        {/* 3D Scene Background - Controlled */}
        <div className="absolute inset-0 z-0">
          <SceneDisplay currentScene={currentScene} />
        </div>

        {/* Scene Selector - Floating on top of everything (z-50) */}
        <div className="absolute top-20 right-4 z-50 md:top-24">
           {/* Positioned below standard header height to be safe */}
           <SceneSwitcher currentScene={currentScene} onSceneChange={setCurrentScene} />
        </div>

        {/* Overlay UI */}
        <div className="relative z-10 flex flex-col h-full pointer-events-none">
          {/* Top UI - Title */}
          <animated.div
            style={heroSpring}
            className="p-4 text-center pointer-events-auto"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-1">
              {viewModel.hero.title}
            </h1>
            <p className="text-lg text-purple-300 drop-shadow-md">
              {viewModel.hero.subtitle}
            </p>
          </animated.div>

          {/* Game Stats Panel */}
          <div className="absolute top-20 left-4 pointer-events-auto">
            <div className="glass-effect rounded-lg p-3 max-w-[180px] bg-black/40 backdrop-blur-md border border-purple-500/30">
              <h3 className="text-sm font-bold text-white mb-2">💎 Crystal Stats</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-purple-300">Crystals</span>
                  <span className="text-cyan-400 font-bold">1,250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Towers</span>
                  <span className="text-cyan-400 font-bold">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Enemies</span>
                  <span className="text-red-400 font-bold">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom UI - Action Buttons */}
          <div className="p-4 pointer-events-auto">
            {/* News Card */}
            {viewModel.news.map((newsItem) => (
              <div
                key={newsItem.id}
                className="glass-effect rounded-lg p-3 mb-4 max-w-md mx-auto bg-black/40 backdrop-blur-md border border-purple-500/30"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-white">
                    {newsItem.title}
                  </h3>
                  {newsItem.isNew && (
                    <span className="text-xs text-purple-300 bg-purple-500/30 px-2 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-xs text-purple-200/70">
                  {newsItem.content}
                </p>
              </div>
            ))}

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              {viewModel.quickActions.map((action, index) => (
                <animated.div key={action.id} style={actionSprings[index]}>
                  <Link href={action.href}>
                    <GameButton
                      variant={action.variant}
                      size="md"
                      icon={action.icon}
                    >
                      {action.label}
                    </GameButton>
                  </Link>
                </animated.div>
              ))}
            </div>
          </div>
        </div>

        {/* Camera controls hint */}
        <div className="absolute bottom-20 right-4 z-10 text-xs text-white/50 pointer-events-none">
          <p>🖱️ Drag to rotate</p>
          <p>🔍 Scroll to zoom</p>
        </div>
      </div>
    </MainLayout>
  );
}
