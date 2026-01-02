"use client";

import { Rarity } from "@/src/application/repositories/ICharacterRepository";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { SummonViewModel } from "@/src/presentation/presenters/summon/SummonPresenter";
import { useSummonPresenter } from "@/src/presentation/presenters/summon/useSummonPresenter";

interface SummonViewProps {
  initialViewModel?: SummonViewModel;
}

const rarityColors: Record<Rarity, string> = {
  common: "border-gray-400 bg-gray-400/20",
  uncommon: "border-green-400 bg-green-400/20",
  rare: "border-cyan-400 bg-cyan-400/20",
  epic: "border-purple-400 bg-purple-400/20",
  legendary: "border-yellow-400 bg-yellow-400/20",
  mythic: "border-red-400 bg-red-400/20",
};

export function SummonView({ initialViewModel }: SummonViewProps) {
  const [state, actions] = useSummonPresenter(initialViewModel);
  const viewModel = state.viewModel;
  const selectedBanner = viewModel?.selectedBanner;

  if (state.loading && !viewModel) {
    return (
      <MainLayout>
        <div className="relative w-full h-full flex items-center justify-center">
          <CrystalBubbleAnimation count={15} />
          <div className="text-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading Summon...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={20} />

        {/* Header */}
        <div className="relative z-10 p-4 border-b border-[var(--border-color)]">
          <h1 className="text-2xl font-bold text-gradient-gold">✨ Summon</h1>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1">
              <span>💎</span>
              <span className="text-[var(--text-secondary)]">Crystals:</span>
              <span className="text-[var(--text-primary)] font-bold">2,500</span>
            </span>
            <span className="flex items-center gap-1">
              <span>🎫</span>
              <span className="text-[var(--text-secondary)]">Tickets:</span>
              <span className="text-[var(--text-primary)] font-bold">{viewModel?.stats.currentTickets}</span>
            </span>
          </div>
        </div>

        {/* Banner Selection */}
        <div className="relative z-10 px-4 py-2 flex gap-2 overflow-x-auto border-b border-[var(--border-color)]">
          {viewModel?.banners.map((banner) => (
            <button
              key={banner.id}
              onClick={() => actions.selectBanner(banner)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                selectedBanner?.id === banner.id
                  ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-black font-bold"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {banner.type === "featured" && "🔥 "}
              {banner.type === "limited" && "⏰ "}
              {banner.name}
            </button>
          ))}
        </div>

        {/* Selected Banner Info */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4">
          {selectedBanner && (
            <div className="game-card p-6 text-center">
              <h2 className="text-xl font-bold text-gradient-primary mb-2">{selectedBanner.name}</h2>
              <p className="text-[var(--text-secondary)] mb-4">{selectedBanner.description}</p>

              {/* Pity Counter */}
              <div className="mb-4 p-3 bg-[var(--bg-tertiary)] rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--text-secondary)]">Pity Counter</span>
                  <span className="text-[var(--color-primary)]">{selectedBanner.currentPity} / {selectedBanner.pityCount}</span>
                </div>
                <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
                    style={{ width: `${(selectedBanner.currentPity / selectedBanner.pityCount) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Guaranteed {selectedBanner.guaranteedRarity || "legendary"} at {selectedBanner.pityCount} summons
                </p>
              </div>

              {/* Rate Up Characters */}
              {selectedBanner.rateUp.length > 0 && (
                <div className="mb-4 p-3 bg-[var(--bg-tertiary)] rounded-lg">
                  <h3 className="text-sm font-bold text-[var(--color-secondary)] mb-2">🔥 Rate Up</h3>
                  {selectedBanner.rateUp.map((ru) => (
                    <div key={ru.characterId} className="flex justify-between items-center">
                      <span className="font-bold">{ru.name}</span>
                      <span className={`text-xs capitalize ${ru.rarity === "mythic" ? "text-red-400" : "text-yellow-400"}`}>
                        {ru.rarity} ({ru.rate}%)
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Summon Animation Area */}
              {state.isSummoning && (
                <div className="relative h-40 mb-4 flex items-center justify-center">
                  <div className="animate-pulse text-6xl">✨</div>
                  <div className="absolute inset-0 bg-gradient-radial from-[var(--color-primary)]/20 to-transparent animate-ping" />
                </div>
              )}

              {/* Summon Buttons */}
              <div className="flex gap-4 justify-center">
                <GameButton
                  variant="ghost"
                  onClick={() => actions.summonSingle(selectedBanner.id)}
                  disabled={state.isSummoning}
                >
                  {selectedBanner.currency === "crystal" ? "💎" : "🎫"} x{selectedBanner.costPerSingle}
                  <span className="block text-xs">Single</span>
                </GameButton>
                <GameButton
                  variant="primary"
                  onClick={() => actions.summonMulti(selectedBanner.id)}
                  disabled={state.isSummoning}
                >
                  {selectedBanner.currency === "crystal" ? "💎" : "🎫"} x{selectedBanner.costPerMulti}
                  <span className="block text-xs">10x Multi</span>
                </GameButton>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="mt-4 game-card p-4">
            <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-2">📊 Your Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{viewModel?.stats.totalSummons}</p>
                <p className="text-xs text-[var(--text-muted)]">Total Summons</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">{viewModel?.stats.legendaryPulled}</p>
                <p className="text-xs text-[var(--text-muted)]">Legendary</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">{viewModel?.stats.mythicPulled}</p>
                <p className="text-xs text-[var(--text-muted)]">Mythic</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summon Result Modal */}
        {state.summonResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="game-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-center text-gradient-gold mb-4">✨ Summon Results</h2>
              
              <div className="grid grid-cols-5 gap-2 mb-4">
                {state.summonResult.characters.map((sr, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-1 ${rarityColors[sr.character.rarity]}`}
                  >
                    <span className="text-2xl">👤</span>
                    <span className="text-[8px] text-center truncate w-full">{sr.character.name}</span>
                    {sr.isNew && <span className="text-[8px] text-green-400">NEW!</span>}
                  </div>
                ))}
              </div>

              {state.summonResult.pityReached && (
                <div className="text-center mb-4 text-yellow-400 font-bold">
                  🎉 Pity Reached! Guaranteed Rare!
                </div>
              )}

              <GameButton variant="primary" fullWidth onClick={actions.clearResult}>
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
