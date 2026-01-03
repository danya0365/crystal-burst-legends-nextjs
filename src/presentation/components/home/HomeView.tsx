"use client";

/**
 * HomeView
 * Main game home screen with 3D pixel art camping scene and team characters
 */

import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CampScene3DWrapper, type CharacterConfig } from "@/src/presentation/components/effects/CampScene3DWrapper";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import type { HomeViewModel } from "@/src/presentation/presenters/home/HomePresenter";
import { useHomePresenter } from "@/src/presentation/presenters/home/useHomePresenter";
import Link from "next/link";
import { useState } from "react";
import { animated } from "react-spring";

// Default team configuration - can be customized
const DEFAULT_TEAM: CharacterConfig[] = [
  {
    id: "1",
    name: "Arthur",
    type: "warrior",
    position: [-1.2, 0, 0.8],
    color: "#4A5568",
    accentColor: "#1A202C",
  },
  {
    id: "2",
    name: "Merlin",
    type: "mage",
    position: [1.2, 0, 0.8],
    color: "#5B21B6",
    accentColor: "#7C3AED",
  },
  {
    id: "3",
    name: "Robin",
    type: "archer",
    position: [-0.8, 0, -1],
    color: "#065F46",
    accentColor: "#047857",
  },
  {
    id: "4",
    name: "Clara",
    type: "healer",
    position: [0.8, 0, -1],
    color: "#FAFAFA",
    accentColor: "#FCD34D",
  },
  {
    id: "5",
    name: "Shadow",
    type: "rogue",
    position: [0, 0, 1.5],
    color: "#1F2937",
    accentColor: "#374151",
  },
];

interface HomeViewProps {
  initialViewModel?: HomeViewModel;
  team?: CharacterConfig[];
}

export function HomeView({ initialViewModel, team }: HomeViewProps) {
  const { viewModel, isLoading, heroSpring, actionSprings } =
    useHomePresenter(initialViewModel);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const currentTeam = team || DEFAULT_TEAM;

  if (isLoading || !viewModel) {
    return (
      <MainLayout>
        <div className="w-full h-full flex items-center justify-center bg-[#0a1628]">
          <div className="text-center">
            <div className="text-6xl animate-pulse mb-4">🏕️</div>
            <p className="text-[var(--text-secondary)]">Loading camp...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        {/* 3D Camping Scene Background */}
        <div className="absolute inset-0 z-0">
          <CampScene3DWrapper
            team={currentTeam}
            selectedCharacterId={selectedCharacterId || undefined}
            onCharacterClick={setSelectedCharacterId}
          />
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
            <p className="text-lg text-[var(--color-secondary)] drop-shadow-md">
              {viewModel.hero.subtitle}
            </p>
          </animated.div>

          {/* Team Info Panel */}
          <div className="absolute top-20 left-4 pointer-events-auto">
            <div className="glass-effect rounded-lg p-3 max-w-[200px]">
              <h3 className="text-sm font-bold text-white mb-2">⚔️ Team</h3>
              <div className="space-y-1">
                {currentTeam.map((char, index) => (
                  <div
                    key={char.id}
                    className={`flex items-center gap-2 px-2 py-1 rounded text-xs cursor-pointer transition-colors ${
                      selectedCharacterId === char.id
                        ? "bg-[var(--color-primary)]/30"
                        : "hover:bg-white/10"
                    }`}
                    onClick={() => setSelectedCharacterId(char.id)}
                  >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-gradient-to-br from-gray-600 to-gray-800">
                      {index + 1}
                    </span>
                    <span className="text-white">{char.name}</span>
                    <span className="text-[var(--text-muted)] capitalize text-[10px]">
                      {char.type}
                    </span>
                  </div>
                ))}
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
                className="glass-effect rounded-lg p-3 mb-4 max-w-md mx-auto"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-white">
                    {newsItem.title}
                  </h3>
                  {newsItem.isNew && (
                    <span className="text-xs text-[var(--color-primary)] bg-[var(--color-primary)]/20 px-2 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
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
