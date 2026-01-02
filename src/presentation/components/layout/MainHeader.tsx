"use client";

import { ThemeToggle } from "@/src/presentation/components/common/ThemeToggle";

interface PlayerInfo {
  level: number;
  name: string;
  crystals: number;
  coins: number;
  energy: number;
  maxEnergy: number;
}

interface MainHeaderProps {
  player?: PlayerInfo;
}

const defaultPlayer: PlayerInfo = {
  level: 1,
  name: "Player",
  crystals: 100,
  coins: 5000,
  energy: 10,
  maxEnergy: 10,
};

/**
 * MainHeader
 * Top header with game logo, player info, resources, and theme toggle
 */
export function MainHeader({ player = defaultPlayer }: MainHeaderProps) {
  return (
    <header className="game-header">
      {/* Left - Logo & Player Info */}
      <div className="flex items-center gap-3">
        <h1 className="game-logo">Crystal Burst</h1>
        <div className="player-info">
          <div className="player-level">{player.level}</div>
          <span className="text-sm text-[var(--text-secondary)] hidden sm:inline">
            {player.name}
          </span>
        </div>
      </div>

      {/* Center - Resources */}
      <div className="resource-bar">
        {/* Crystals */}
        <div className="resource-item">
          <span className="resource-icon">💎</span>
          <span className="resource-value">{player.crystals.toLocaleString()}</span>
        </div>

        {/* Coins */}
        <div className="resource-item">
          <span className="resource-icon">🪙</span>
          <span className="resource-value">{player.coins.toLocaleString()}</span>
        </div>

        {/* Energy */}
        <div className="resource-item">
          <span className="resource-icon">⚡</span>
          <span className="resource-value">
            {player.energy}/{player.maxEnergy}
          </span>
        </div>
      </div>

      {/* Right - Theme Toggle */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
