"use client";

import { GachaPullResult } from "@/src/application/repositories/IGachaRepository";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { GachaViewModel } from "@/src/presentation/presenters/gacha/GachaPresenter";
import { useGachaPresenter } from "@/src/presentation/presenters/gacha/useGachaPresenter";
import { useState } from "react";

interface SummonViewProps {
  initialViewModel?: GachaViewModel;
}

const RARITY_COLORS: Record<string, string> = {
  common: "from-gray-400 to-gray-600",
  uncommon: "from-green-400 to-green-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-500",
  mythic: "from-red-400 to-pink-500",
};

const RARITY_GLOW: Record<string, string> = {
  common: "",
  uncommon: "shadow-green-500/30",
  rare: "shadow-blue-500/50",
  epic: "shadow-purple-500/50",
  legendary: "shadow-yellow-500/60",
  mythic: "shadow-red-500/70",
};

function PullAnimation({ onComplete }: { onComplete: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onComplete}
    >
      <div className="text-center">
        <div className="relative">
          <span className="text-[150px] animate-spin inline-block">💎</span>
          <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 to-transparent animate-pulse" />
        </div>
        <p className="text-white/50 text-sm mt-8 animate-pulse">Tap to skip</p>
      </div>
    </div>
  );
}

function ResultCard({ result, index }: { result: GachaPullResult; index: number }) {
  const { character, isNew, shardsEarned } = result;
  const colorClass = RARITY_COLORS[character.rarity] || RARITY_COLORS.common;
  const glowClass = RARITY_GLOW[character.rarity] || "";
  
  return (
    <div 
      className={`relative game-card p-4 text-center transform transition-all duration-500 hover:scale-105 ${glowClass} shadow-lg`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {isNew && (
        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full animate-bounce z-10">
          NEW!
        </span>
      )}
      <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center mb-3 shadow-lg`}>
        <span className="text-4xl">
          {character.rarity === "mythic" ? "👑" : 
           character.rarity === "legendary" ? "⭐" :
           character.rarity === "epic" ? "💎" :
           character.rarity === "rare" ? "✨" :
           character.rarity === "uncommon" ? "🌟" : "⚪"}
        </span>
      </div>
      <h3 className="font-bold text-[var(--text-primary)] text-sm truncate">{character.name}</h3>
      <p className={`text-xs capitalize bg-gradient-to-r ${colorClass} bg-clip-text text-transparent font-bold`}>
        {character.rarity}
      </p>
      {!isNew && shardsEarned > 0 && (
        <p className="text-xs text-[var(--text-muted)] mt-1">+{shardsEarned} shards</p>
      )}
    </div>
  );
}

function ResultsModal({ results, onClose }: { results: GachaPullResult[]; onClose: () => void }) {
  // Sort by rarity (best first)
  const rarityOrder = ["mythic", "legendary", "epic", "rare", "uncommon", "common"];
  const sorted = [...results].sort((a, b) => 
    rarityOrder.indexOf(a.character.rarity) - rarityOrder.indexOf(b.character.rarity)
  );
  
  const newCount = results.filter(r => r.isNew).length;
  const hasLegendary = results.some(r => r.character.rarity === "legendary" || r.character.rarity === "mythic");
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="game-card max-w-3xl w-full p-6 my-8">
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold ${hasLegendary ? "text-gradient-gold" : "text-gradient-primary"}`}>
            {hasLegendary ? "🎉 Legendary Pull! 🎉" : "Summon Results"}
          </h2>
          <p className="text-[var(--text-secondary)]">
            {newCount > 0 ? `${newCount} new character${newCount > 1 ? "s" : ""}!` : "Duplicates converted to shards"}
          </p>
        </div>
        
        <div className={`grid gap-4 ${results.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-5"}`}>
          {sorted.map((result, i) => (
            <ResultCard key={`${result.character.id}-${i}`} result={result} index={i} />
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <GameButton variant="primary" onClick={onClose}>
            Continue
          </GameButton>
        </div>
      </div>
    </div>
  );
}

export function SummonView({ initialViewModel }: SummonViewProps) {
  const [state, actions] = useGachaPresenter(initialViewModel);
  const { viewModel, loading, error, isPulling, pullResults, showResults, selectedBanner } = state;
  const [showAnimation, setShowAnimation] = useState(false);
  const [pendingResults, setPendingResults] = useState<GachaPullResult[]>([]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
        </div>
      </MainLayout>
    );
  }

  if (error && !viewModel) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <GameButton variant="primary" onClick={actions.loadData}>Retry</GameButton>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handlePull = async (type: "single" | "multi") => {
    setShowAnimation(true);
    
    try {
      if (type === "single") {
        await actions.pullSingle();
      } else {
        await actions.pullMulti();
      }
    } catch (e) {
      setShowAnimation(false);
    }
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  const canAffordSingle = viewModel ? viewModel.crystals >= viewModel.singleCost.crystals : false;
  const canAffordMulti = viewModel ? viewModel.crystals >= viewModel.multiCost.crystals : false;

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={15} />

        {/* Header */}
        <div className="relative z-10 p-4 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient-primary">Summon</h1>
              <p className="text-sm text-[var(--text-secondary)]">Collect powerful heroes!</p>
            </div>
            <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] px-3 py-2 rounded-full">
              <span className="text-lg">💎</span>
              <span className="font-bold text-[var(--color-primary)]">{viewModel?.crystals.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4">
          {/* Banner Selection */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[var(--text-secondary)]">Select Banner</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {viewModel?.banners.map((banner) => (
                <button
                  key={banner.id}
                  onClick={() => actions.selectBanner(banner)}
                  className={`game-card p-3 min-w-[200px] text-left transition-all ${
                    selectedBanner?.id === banner.id 
                      ? "ring-2 ring-[var(--color-primary)] scale-105" 
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <h4 className="font-bold text-[var(--text-primary)]">{banner.name}</h4>
                  <p className="text-xs text-[var(--text-muted)]">{banner.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Banner Display */}
          {selectedBanner && (
            <div className="game-card p-6 text-center bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]">
              <div className="mb-4">
                <span className="text-6xl animate-pulse">✨</span>
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">{selectedBanner.name}</h2>
              <p className="text-[var(--text-secondary)] mb-4">{selectedBanner.description}</p>
              
              {/* Pity Counter */}
              {viewModel?.pityInfo && (
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-[var(--text-muted)]">Pity:</span>
                    <span className="font-bold text-[var(--color-primary)]">{viewModel.pityInfo.currentPity}</span>
                    <span className="text-[var(--text-muted)]">/ {viewModel.pityInfo.hardPity}</span>
                  </div>
                  <div className="w-full max-w-xs mx-auto h-2 bg-[var(--bg-tertiary)] rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-300"
                      style={{ width: `${(viewModel.pityInfo.currentPity / viewModel.pityInfo.hardPity) * 100}%` }}
                    />
                  </div>
                  {viewModel.pityInfo.currentPity >= viewModel.pityInfo.softPityStart && (
                    <p className="text-xs text-yellow-400 mt-1">⬆️ Soft Pity Active!</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Rates Info */}
          <details className="game-card p-4">
            <summary className="cursor-pointer font-bold text-[var(--text-secondary)]">📊 Drop Rates</summary>
            <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
              {viewModel && Object.entries(viewModel.rates).map(([rarity, rate]) => (
                <div key={rarity} className="text-center">
                  <span className={`capitalize font-bold bg-gradient-to-r ${RARITY_COLORS[rarity]} bg-clip-text text-transparent`}>
                    {rarity}
                  </span>
                  <p className="text-[var(--text-muted)]">{(rate * 100).toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </details>

          {/* Pull Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handlePull("single")}
              disabled={!canAffordSingle || isPulling}
              className={`game-card p-4 text-center transition-all ${
                canAffordSingle && !isPulling 
                  ? "hover:scale-105 cursor-pointer" 
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <span className="text-3xl block mb-2">💎</span>
              <h3 className="font-bold text-[var(--text-primary)]">Single Pull</h3>
              <p className="text-[var(--color-primary)] font-bold">
                {viewModel?.singleCost.crystals} Crystals
              </p>
            </button>
            
            <button
              onClick={() => handlePull("multi")}
              disabled={!canAffordMulti || isPulling}
              className={`game-card p-4 text-center transition-all relative ${
                canAffordMulti && !isPulling 
                  ? "hover:scale-105 cursor-pointer ring-2 ring-[var(--color-secondary)]" 
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              {viewModel?.multiCost.discount && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  -{viewModel.multiCost.discount}%
                </span>
              )}
              <span className="text-3xl block mb-2">💎×10</span>
              <h3 className="font-bold text-gradient-gold">10x Pull</h3>
              <p className="text-[var(--color-secondary)] font-bold">
                {viewModel?.multiCost.crystals} Crystals
              </p>
            </button>
          </div>

          {error && (
            <div className="game-card p-4 bg-red-500/20 border-red-500 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Pull Animation */}
      {showAnimation && isPulling && (
        <PullAnimation onComplete={handleAnimationComplete} />
      )}

      {/* Results Modal */}
      {showResults && pullResults.length > 0 && !showAnimation && (
        <ResultsModal results={pullResults} onClose={actions.closeResults} />
      )}
    </MainLayout>
  );
}
