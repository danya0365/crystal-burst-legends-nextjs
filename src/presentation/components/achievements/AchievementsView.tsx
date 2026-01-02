"use client";

import { AchievementCategory } from "@/src/application/repositories/IAchievementRepository";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { AchievementsViewModel } from "@/src/presentation/presenters/achievements/AchievementsPresenter";
import { useAchievementsPresenter } from "@/src/presentation/presenters/achievements/useAchievementsPresenter";

interface AchievementsViewProps {
  initialViewModel?: AchievementsViewModel;
}

const categoryLabels: Record<AchievementCategory | "all", { label: string; icon: string }> = {
  all: { label: "All", icon: "🏆" },
  combat: { label: "Combat", icon: "⚔️" },
  collection: { label: "Collection", icon: "👥" },
  progression: { label: "Progress", icon: "📈" },
  social: { label: "Social", icon: "🤝" },
  special: { label: "Special", icon: "⭐" },
};

export function AchievementsView({ initialViewModel }: AchievementsViewProps) {
  const [state, actions] = useAchievementsPresenter(initialViewModel);
  const viewModel = state.viewModel;

  if (state.loading && !viewModel) {
    return (
      <MainLayout>
        <div className="relative w-full h-full flex items-center justify-center">
          <CrystalBubbleAnimation count={10} />
          <div className="text-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading achievements...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const achievements = viewModel?.achievements || [];
  const stats = viewModel?.stats;
  const categories: (AchievementCategory | "all")[] = ["all", "combat", "collection", "progression", "social", "special"];

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={6} />

        {/* Header */}
        <div className="relative z-10 p-4 border-b border-[var(--border-color)]">
          <h1 className="text-2xl font-bold text-gradient-primary">Achievements</h1>
          {stats && (
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-[var(--text-secondary)]">
                Completed: <span className="text-green-400 font-bold">{stats.completed}/{stats.total}</span>
              </span>
              <span className="text-[var(--text-secondary)]">
                Points: <span className="text-yellow-400 font-bold">{stats.points}</span>
              </span>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="relative z-10 px-4 py-2 flex gap-2 overflow-x-auto border-b border-[var(--border-color)]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => actions.setCategory(cat)}
              className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                state.selectedCategory === cat
                  ? "bg-[var(--color-primary)] text-black font-bold"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
              }`}
            >
              {categoryLabels[cat].icon} {categoryLabels[cat].label}
            </button>
          ))}
        </div>

        {/* Achievements List */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`game-card p-4 ${achievement.claimed ? "opacity-50" : ""}`}
            >
              <div className="flex gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  achievement.completed ? "bg-green-500/20" : "bg-[var(--bg-tertiary)]"
                }`}>
                  {achievement.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[var(--text-primary)]">{achievement.title}</h3>
                      <p className="text-xs text-[var(--text-secondary)]">{achievement.description}</p>
                    </div>
                    {achievement.claimed ? (
                      <span className="text-green-400 text-sm">✓</span>
                    ) : achievement.completed ? (
                      <GameButton variant="primary" size="sm" onClick={() => actions.claimAchievement(achievement.id)}>
                        Claim
                      </GameButton>
                    ) : null}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--text-muted)]">Progress</span>
                      <span className={achievement.completed ? "text-green-400" : "text-[var(--text-secondary)]"}>
                        {Math.min(achievement.progress, achievement.target)}/{achievement.target}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${achievement.completed ? "bg-green-500" : "bg-[var(--color-primary)]"}`}
                        style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Reward */}
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <span className="text-[var(--text-muted)]">Reward:</span>
                    <span className="text-yellow-400">
                      {achievement.reward.type === "crystal" ? "💎" : achievement.reward.type === "coin" ? "🪙" : "🎖️"}
                      {achievement.reward.amount > 1 ? ` ${achievement.reward.amount}` : ""} {achievement.reward.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {achievements.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64">
              <span className="text-6xl mb-4">🏆</span>
              <p className="text-[var(--text-secondary)]">No achievements found</p>
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
