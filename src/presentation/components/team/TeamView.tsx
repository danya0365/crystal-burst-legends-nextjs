"use client";

import { Rarity } from "@/src/application/repositories/ICharacterRepository";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { TeamViewModel } from "@/src/presentation/presenters/team/TeamPresenter";
import { useTeamPresenter } from "@/src/presentation/presenters/team/useTeamPresenter";

interface TeamViewProps {
  initialViewModel?: TeamViewModel;
}

const rarityColors: Record<Rarity, string> = {
  common: "border-gray-400",
  uncommon: "border-green-400",
  rare: "border-cyan-400",
  epic: "border-purple-400",
  legendary: "border-yellow-400",
  mythic: "border-red-400",
};

export function TeamView({ initialViewModel }: TeamViewProps) {
  const [state, actions] = useTeamPresenter(initialViewModel);
  const viewModel = state.viewModel;

  if (state.loading && !viewModel) {
    return (
      <MainLayout>
        <div className="relative w-full h-full flex items-center justify-center">
          <CrystalBubbleAnimation count={10} />
          <div className="text-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading team...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const totalPower = state.team.reduce((sum, c) => sum + (c?.power || 0), 0);
  const availableCharacters = (viewModel?.availableCharacters || []).filter(
    (c) => !state.team.some((t) => t?.id === c.id)
  );

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={8} />

        {/* Header */}
        <div className="relative z-10 p-4 border-b border-[var(--border-color)]">
          <h1 className="text-2xl font-bold text-gradient-primary">Team Formation</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Total Power: <span className="text-[var(--color-primary)] font-bold">{totalPower.toLocaleString()}</span>
          </p>
        </div>

        {/* Team Slots */}
        <div className="relative z-10 p-4 border-b border-[var(--border-color)]">
          <h2 className="text-sm font-bold text-[var(--text-secondary)] mb-3">Your Team</h2>
          <div className="flex gap-3 justify-center">
            {state.team.map((member, index) => (
              <div
                key={index}
                onClick={() => member ? actions.removeFromTeam(index) : actions.selectSlot(index)}
                className={`
                  w-16 h-20 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all
                  ${state.selectedSlot === index ? "border-[var(--color-primary)] bg-[var(--color-primary)]/20" : "border-[var(--border-color)]"}
                  ${member ? rarityColors[member.rarity] : "border-dashed"}
                `}
              >
                {member ? (
                  <>
                    <span className="text-2xl">👤</span>
                    <span className="text-[8px] text-center truncate w-full px-1">{member.name}</span>
                    <span className="text-[10px] text-[var(--color-primary)]">⚔{member.power}</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl opacity-30">+</span>
                    <span className="text-[8px] text-[var(--text-muted)]">Slot {index + 1}</span>
                  </>
                )}
              </div>
            ))}
          </div>
          {state.selectedSlot !== null && (
            <p className="text-center text-xs text-[var(--color-secondary)] mt-2">
              Select a character for Slot {state.selectedSlot + 1}
            </p>
          )}
        </div>

        {/* Available Characters */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4">
          <h2 className="text-sm font-bold text-[var(--text-secondary)] mb-3">Available Characters</h2>
          
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {availableCharacters.map((character) => (
              <div
                key={character.id}
                onClick={() => state.selectedSlot !== null && actions.addToTeam(character)}
                className={`
                  aspect-[3/4] rounded-xl border-2 ${rarityColors[character.rarity]}
                  flex flex-col items-center justify-center p-1 transition-all
                  ${state.selectedSlot !== null ? "cursor-pointer hover:scale-105" : "opacity-70"}
                `}
              >
                <span className="text-3xl">👤</span>
                <span className="text-xs text-center truncate w-full">{character.name}</span>
                <span className="text-[10px] text-[var(--text-muted)]">Lv.{character.level}</span>
                <span className="text-xs text-[var(--color-primary)]">⚔{character.power}</span>
              </div>
            ))}
          </div>

          {availableCharacters.length === 0 && (
            <div className="text-center text-[var(--text-muted)] py-8">
              All characters are in team
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="relative z-10 p-4 border-t border-[var(--border-color)]">
          <GameButton 
            variant="primary" 
            fullWidth 
            disabled={state.team.filter(Boolean).length === 0 || state.loading}
            onClick={actions.saveTeam}
          >
            {state.loading ? "Saving..." : "Save Team"}
          </GameButton>
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
