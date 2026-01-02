"use client";

import { MissionType } from "@/src/application/repositories/IMissionRepository";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { MissionsViewModel } from "@/src/presentation/presenters/missions/MissionsPresenter";
import { useMissionsPresenter } from "@/src/presentation/presenters/missions/useMissionsPresenter";

interface MissionsViewProps {
  initialViewModel?: MissionsViewModel;
}

const typeLabels: Record<MissionType, { label: string; icon: string }> = {
  daily: { label: "Daily", icon: "📅" },
  weekly: { label: "Weekly", icon: "📆" },
  achievement: { label: "Achievements", icon: "🏆" },
  event: { label: "Events", icon: "🎉" },
};

export function MissionsView({ initialViewModel }: MissionsViewProps) {
  const [state, actions] = useMissionsPresenter(initialViewModel);
  const viewModel = state.viewModel;

  if (state.loading && !viewModel) {
    return (
      <MainLayout>
        <div className="relative w-full h-full flex items-center justify-center">
          <CrystalBubbleAnimation count={10} />
          <div className="text-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading missions...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const missions = viewModel?.missions || [];
  const stats = viewModel?.stats;

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={8} />

        {/* Header */}
        <div className="relative z-10 p-4 border-b border-[var(--border-color)]">
          <h1 className="text-2xl font-bold text-gradient-primary">Missions</h1>
          {stats && (
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-[var(--text-secondary)]">
                Daily: <span className="text-green-400 font-bold">{stats.dailyCompleted}/{stats.dailyTotal}</span>
              </span>
              <span className="text-[var(--text-secondary)]">
                Weekly: <span className="text-cyan-400 font-bold">{stats.weeklyCompleted}/{stats.weeklyTotal}</span>
              </span>
            </div>
          )}
        </div>

        {/* Type Tabs */}
        <div className="relative z-10 px-4 py-2 flex gap-2 overflow-x-auto border-b border-[var(--border-color)]">
          {(["daily", "weekly", "achievement"] as MissionType[]).map((type) => (
            <button
              key={type}
              onClick={() => actions.setType(type)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                state.selectedType === type
                  ? "bg-[var(--color-primary)] text-black font-bold"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
              }`}
            >
              {typeLabels[type].icon} {typeLabels[type].label}
            </button>
          ))}
        </div>

        {/* Mission List */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-3">
          {missions.map((mission) => (
            <div key={mission.id} className={`game-card p-4 ${mission.status === "claimed" ? "opacity-50" : ""}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-[var(--text-primary)]">{mission.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{mission.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--text-muted)]">Progress</span>
                      <span className={mission.progress >= mission.target ? "text-green-400" : "text-[var(--text-secondary)]"}>
                        {mission.progress}/{mission.target}
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${mission.progress >= mission.target ? "bg-green-500" : "bg-[var(--color-primary)]"}`}
                        style={{ width: `${Math.min(100, (mission.progress / mission.target) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="flex gap-2 mt-2">
                    {mission.rewards.map((r, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-[var(--bg-tertiary)] rounded">
                        {r.type === "crystal" ? "💎" : r.type === "coin" ? "🪙" : "📦"} {r.amount}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Claim Button */}
                <div className="ml-4">
                  {mission.status === "claimed" ? (
                    <span className="text-green-400 text-sm">✓ Claimed</span>
                  ) : mission.status === "completed" ? (
                    <GameButton variant="primary" size="sm" onClick={() => actions.claimMission(mission.id)}>
                      Claim
                    </GameButton>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">In Progress</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {missions.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64">
              <span className="text-6xl mb-4">📋</span>
              <p className="text-[var(--text-secondary)]">No missions available</p>
            </div>
          )}
        </div>

        {/* Error Toast */}
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
