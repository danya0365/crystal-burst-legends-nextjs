"use client";

import { PvpRank } from "@/src/application/repositories/IPvpRepository";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { PvpViewModel } from "@/src/presentation/presenters/pvp/PvpPresenter";
import { usePvpPresenter } from "@/src/presentation/presenters/pvp/usePvpPresenter";
import { useState } from "react";

interface PvpViewProps {
  initialViewModel?: PvpViewModel;
}

const rankColors: Record<PvpRank, string> = {
  bronze: "text-orange-600",
  silver: "text-gray-400",
  gold: "text-yellow-400",
  platinum: "text-cyan-400",
  diamond: "text-blue-400",
  legend: "text-purple-400",
};

const rankIcons: Record<PvpRank, string> = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  platinum: "💎",
  diamond: "💠",
  legend: "👑",
};

export function PvpView({ initialViewModel }: PvpViewProps) {
  const [state, actions] = usePvpPresenter(initialViewModel);
  const [tab, setTab] = useState<"battle" | "leaderboard">("battle");
  const viewModel = state.viewModel;

  if (state.loading && !viewModel) {
    return (
      <MainLayout>
        <div className="relative w-full h-full flex items-center justify-center">
          <CrystalBubbleAnimation count={10} />
          <div className="text-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading PVP Arena...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={8} />

        {/* Header with Stats */}
        <div className="relative z-10 p-4 border-b border-[var(--border-color)]">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gradient-primary">PVP Arena</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-2xl ${rankColors[viewModel?.stats.currentRank || "bronze"]}`}>
                  {rankIcons[viewModel?.stats.currentRank || "bronze"]}
                </span>
                <span className="capitalize font-bold">{viewModel?.stats.currentRank}</span>
                <span className="text-[var(--text-secondary)]">
                  ({viewModel?.stats.rankPoints} pts)
                </span>
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="text-[var(--text-secondary)]">Season Rank: <span className="text-[var(--text-primary)] font-bold">#{viewModel?.stats.seasonRank}</span></div>
              <div className="text-green-400">Win Rate: {viewModel?.stats.winRate}%</div>
              <div className="text-yellow-400">🔥 Streak: {viewModel?.stats.currentStreak}</div>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mt-4">
            <GameButton variant={tab === "battle" ? "primary" : "ghost"} size="sm" onClick={() => setTab("battle")}>
              ⚔️ Battle
            </GameButton>
            <GameButton variant={tab === "leaderboard" ? "primary" : "ghost"} size="sm" onClick={() => setTab("leaderboard")}>
              🏆 Leaderboard
            </GameButton>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4">
          {tab === "battle" ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Find Opponents</h2>
                <GameButton variant="ghost" size="sm" onClick={actions.findOpponents} disabled={state.loading}>
                  🔄 Refresh
                </GameButton>
              </div>

              {viewModel?.opponents.map((match) => (
                <div key={match.id} className="game-card p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{rankIcons[match.opponent.rank]}</span>
                        <span className="font-bold">{match.opponent.name}</span>
                        <span className="text-xs text-[var(--text-muted)]">Lv.{match.opponent.level}</span>
                      </div>
                      <div className="text-sm text-[var(--text-secondary)] mt-1">
                        Power: <span className="text-[var(--color-primary)]">{match.opponent.power.toLocaleString()}</span>
                        <span className="mx-2">|</span>
                        W/L: {match.opponent.wins}/{match.opponent.losses}
                      </div>
                    </div>
                    <GameButton variant="secondary" onClick={() => actions.battle(match.id)} disabled={state.loading}>
                      ⚔️ Fight
                    </GameButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <h2 className="text-lg font-bold mb-4">🏆 Season Leaderboard</h2>
              {viewModel?.leaderboard.map((entry) => (
                <div
                  key={entry.player.id}
                  className={`game-card p-3 flex items-center gap-4 ${entry.isCurrentPlayer ? "border-[var(--color-primary)]" : ""}`}
                >
                  <span className={`w-8 text-center font-bold ${entry.rank <= 3 ? "text-yellow-400" : ""}`}>
                    #{entry.rank}
                  </span>
                  <span className="text-xl">{rankIcons[entry.player.rank]}</span>
                  <div className="flex-1">
                    <span className="font-bold">{entry.isCurrentPlayer ? "You" : entry.player.name}</span>
                    <span className="text-xs text-[var(--text-muted)] ml-2">Lv.{entry.player.level}</span>
                  </div>
                  <span className="text-[var(--color-primary)]">{entry.player.rankPoints} pts</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Battle Result Modal */}
        {state.battleResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="game-card w-full max-w-sm text-center">
              <div className={`text-6xl mb-4 ${state.battleResult.result === "win" ? "" : "grayscale"}`}>
                {state.battleResult.result === "win" ? "🏆" : "💔"}
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${state.battleResult.result === "win" ? "text-green-400" : "text-red-400"}`}>
                {state.battleResult.result === "win" ? "Victory!" : "Defeat"}
              </h2>
              <p className={`text-lg ${(state.battleResult.pointsChange || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                {(state.battleResult.pointsChange || 0) >= 0 ? "+" : ""}{state.battleResult.pointsChange} pts
              </p>
              {state.battleResult.rewards && state.battleResult.rewards.length > 0 && (
                <div className="mt-4 flex justify-center gap-2">
                  {state.battleResult.rewards.map((r, i) => (
                    <span key={i} className="px-2 py-1 bg-[var(--bg-tertiary)] rounded text-sm">
                      {r.type === "coin" ? "🪙" : "💎"} {r.amount}
                    </span>
                  ))}
                </div>
              )}
              <GameButton variant="primary" className="mt-6" onClick={actions.clearBattleResult}>
                Continue
              </GameButton>
            </div>
          </div>
        )}

        {state.error && (
          <div className="fixed bottom-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg z-50">
            {state.error}
            <button onClick={() => actions.setError(null)} className="ml-2">✕</button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
