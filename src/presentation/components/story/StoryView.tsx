"use client";

import { Chapter, Stage, StageStatus } from "@/src/application/repositories/IStoryRepository";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { StoryViewModel } from "@/src/presentation/presenters/story/StoryPresenter";
import { useStoryPresenter } from "@/src/presentation/presenters/story/useStoryPresenter";

interface StoryViewProps {
  initialViewModel?: StoryViewModel;
}

const statusColors: Record<StageStatus, string> = {
  locked: "bg-gray-600 opacity-50",
  available: "bg-[var(--color-primary)]",
  completed: "bg-green-500",
  "3star": "bg-yellow-500",
};

export function StoryView({ initialViewModel }: StoryViewProps) {
  const [state, actions] = useStoryPresenter(initialViewModel);
  const viewModel = state.viewModel;

  if (state.loading && !viewModel) {
    return (
      <MainLayout>
        <div className="relative w-full h-full flex items-center justify-center">
          <CrystalBubbleAnimation count={10} />
          <div className="text-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading story...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const story = viewModel?.selectedStory;
  const chapters = story?.chapters || [];

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={8} />

        {/* Header */}
        <div className="relative z-10 p-4 border-b border-[var(--border-color)]">
          <h1 className="text-2xl font-bold text-gradient-primary">Story Mode</h1>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="text-[var(--text-secondary)]">
              Chapters: <span className="text-[var(--text-primary)] font-bold">
                {viewModel?.stats.completedChapters || 0}/{viewModel?.stats.totalChapters || 0}
              </span>
            </span>
            <span className="text-[var(--text-secondary)]">
              Stars: <span className="text-yellow-400 font-bold">
                {viewModel?.stats.earnedStars || 0}/{viewModel?.stats.totalStars || 0} ⭐
              </span>
            </span>
          </div>
        </div>

        {/* Chapter List or Stage View */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4">
          {state.selectedChapter ? (
            <ChapterStagesView
              chapter={state.selectedChapter}
              onBack={() => actions.selectChapter(null)}
              onSelectStage={actions.selectStage}
              selectedStage={state.selectedStage}
            />
          ) : (
            <ChapterListView
              chapters={chapters}
              onSelectChapter={actions.selectChapter}
            />
          )}
        </div>

        {/* Stage Detail Modal */}
        {state.selectedStage && (
          <StageDetailModal
            stage={state.selectedStage}
            onClose={() => actions.selectStage(null)}
            onBattle={() => actions.completeStage(state.selectedStage!.id, Math.floor(Math.random() * 3) + 1)}
            loading={state.loading}
          />
        )}

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

interface ChapterListViewProps {
  chapters: Chapter[];
  onSelectChapter: (chapter: Chapter) => void;
}

function ChapterListView({ chapters, onSelectChapter }: ChapterListViewProps) {
  return (
    <div className="space-y-4">
      {chapters.map((chapter) => (
        <div
          key={chapter.id}
          onClick={() => chapter.isUnlocked && onSelectChapter(chapter)}
          className={`
            game-card p-4 cursor-pointer transition-all
            ${chapter.isUnlocked ? "hover:border-[var(--color-primary)]" : "opacity-50 cursor-not-allowed"}
          `}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">{chapter.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{chapter.description}</p>
              <div className="flex gap-4 mt-2 text-xs">
                <span className="text-[var(--text-muted)]">
                  Stages: {chapter.completedStages}/{chapter.totalStages}
                </span>
                <span className="text-yellow-400">
                  {"⭐".repeat(Math.min(3, Math.floor(chapter.completedStages / 2)))}
                </span>
              </div>
            </div>
            <div className="text-right">
              {chapter.isUnlocked ? (
                chapter.completedStages === chapter.totalStages ? (
                  <span className="text-green-400 text-2xl">✓</span>
                ) : (
                  <span className="text-[var(--color-primary)] text-xl">→</span>
                )
              ) : (
                <span className="text-2xl">🔒</span>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
              style={{ width: `${(chapter.completedStages / chapter.totalStages) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface ChapterStagesViewProps {
  chapter: Chapter;
  onBack: () => void;
  onSelectStage: (stage: Stage) => void;
  selectedStage: Stage | null;
}

function ChapterStagesView({ chapter, onBack, onSelectStage }: ChapterStagesViewProps) {
  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4"
      >
        <span>←</span>
        <span>Back to Chapters</span>
      </button>

      {/* Chapter Title */}
      <h2 className="text-xl font-bold text-gradient-primary mb-4">{chapter.name}</h2>

      {/* Stages Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {chapter.stages.map((stage) => (
          <div
            key={stage.id}
            onClick={() => stage.status !== "locked" && onSelectStage(stage)}
            className={`
              relative aspect-square rounded-xl flex flex-col items-center justify-center
              cursor-pointer transition-all border-2 border-[var(--border-color)]
              ${stage.status === "locked" ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:border-[var(--color-primary)]"}
              ${statusColors[stage.status]}
            `}
          >
            <span className="text-2xl font-bold text-white">{stage.number}</span>
            {stage.status === "locked" ? (
              <span className="text-xl mt-1">🔒</span>
            ) : (
              <div className="text-yellow-300 text-xs mt-1">
                {"★".repeat(stage.stars)}{"☆".repeat(stage.maxStars - stage.stars)}
              </div>
            )}
            {stage.difficulty !== "normal" && (
              <span className={`absolute top-1 right-1 text-xs px-1 rounded ${
                stage.difficulty === "hard" ? "bg-orange-500" : "bg-red-500"
              }`}>
                {stage.difficulty === "hard" ? "H" : "EX"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface StageDetailModalProps {
  stage: Stage;
  onClose: () => void;
  onBattle: () => void;
  loading: boolean;
}

function StageDetailModal({ stage, onClose, onBattle, loading }: StageDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="game-card w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gradient-primary">{stage.name}</h2>
            <p className="text-sm text-[var(--text-secondary)] capitalize">
              {stage.difficulty} • ⚡{stage.energyCost} Energy
            </p>
          </div>
          <button onClick={onClose} className="text-2xl text-[var(--text-muted)] hover:text-white">✕</button>
        </div>

        {/* Recommended Power */}
        <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg mb-4">
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Recommended Power</span>
            <span className="text-[var(--color-primary)] font-bold">{stage.recommendedPower.toLocaleString()}</span>
          </div>
        </div>

        {/* Enemies */}
        <div className="mb-4">
          <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-2">Enemies</h3>
          <div className="space-y-2">
            {stage.enemies.map((enemy) => (
              <div key={enemy.id} className="flex justify-between items-center p-2 bg-[var(--bg-tertiary)] rounded-lg">
                <div>
                  <span className="font-bold text-sm">{enemy.name}</span>
                  <span className="text-xs text-[var(--text-muted)] ml-2">Lv.{enemy.level}</span>
                </div>
                <span className="text-xs text-[var(--color-primary)]">⚔️{enemy.power.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div className="mb-4">
          <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-2">Rewards</h3>
          <div className="flex gap-2">
            {stage.rewards.map((reward, i) => (
              <div key={i} className="flex items-center gap-1 px-2 py-1 bg-[var(--bg-tertiary)] rounded">
                <span>{reward.type === "coin" ? "🪙" : reward.type === "crystal" ? "💎" : "📦"}</span>
                <span className="text-xs">{reward.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Battle Button */}
        <GameButton
          variant="primary"
          fullWidth
          onClick={onBattle}
          disabled={loading || stage.status === "locked"}
        >
          {loading ? "Battling..." : "⚔️ Start Battle"}
        </GameButton>
      </div>
    </div>
  );
}
