"use client";

import { Character, CharacterClass, Element, Rarity } from "@/src/application/repositories/ICharacterRepository";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { CharactersViewModel } from "@/src/presentation/presenters/characters/CharactersPresenter";
import { useCharactersPresenter } from "@/src/presentation/presenters/characters/useCharactersPresenter";
import { useState } from "react";

interface CharactersViewProps {
  initialViewModel?: CharactersViewModel;
}

const rarityColors: Record<Rarity, string> = {
  common: "border-gray-400",
  uncommon: "border-green-400",
  rare: "border-cyan-400",
  epic: "border-purple-400",
  legendary: "border-yellow-400",
  mythic: "border-red-400",
};

const elementIcons: Record<Element, string> = {
  fire: "🔥",
  water: "💧",
  earth: "🪨",
  wind: "🌪️",
  light: "✨",
  dark: "🌑",
};

const classIcons: Record<CharacterClass, string> = {
  warrior: "⚔️",
  mage: "🔮",
  assassin: "🗡️",
  tank: "🛡️",
  support: "💚",
};

export function CharactersView({ initialViewModel }: CharactersViewProps) {
  const [state, actions] = useCharactersPresenter(initialViewModel);
  const [showOwned, setShowOwned] = useState(false);
  const viewModel = state.viewModel;

  const displayCharacters = showOwned 
    ? viewModel?.ownedCharacters || []
    : viewModel?.characters || [];

  if (state.loading && !viewModel) {
    return (
      <MainLayout>
        <div className="relative w-full h-full flex items-center justify-center">
          <CrystalBubbleAnimation count={10} />
          <div className="text-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading characters...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={8} />

        {/* Header */}
        <div className="relative z-10 p-4 flex items-center justify-between border-b border-[var(--border-color)]">
          <div>
            <h1 className="text-2xl font-bold text-gradient-primary">Characters</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {viewModel?.stats.ownedCharacters || 0} / {viewModel?.stats.totalCharacters || 0} Owned
            </p>
          </div>
          <div className="flex gap-2">
            <GameButton
              variant={showOwned ? "primary" : "ghost"}
              size="sm"
              onClick={() => setShowOwned(!showOwned)}
            >
              {showOwned ? "All" : "Owned"}
            </GameButton>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative z-10 px-4 py-2 flex gap-4 text-sm border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
          <span className="flex items-center gap-1">
            <span className="text-yellow-400">👑</span>
            <span className="text-[var(--text-secondary)]">Legendary:</span>
            <span className="text-[var(--text-primary)] font-bold">{viewModel?.stats.legendaryCount || 0}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-red-400">🔥</span>
            <span className="text-[var(--text-secondary)]">Mythic:</span>
            <span className="text-[var(--text-primary)] font-bold">{viewModel?.stats.mythicCount || 0}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-cyan-400">⚡</span>
            <span className="text-[var(--text-secondary)]">Avg Power:</span>
            <span className="text-[var(--text-primary)] font-bold">{viewModel?.stats.averagePower?.toLocaleString() || 0}</span>
          </span>
        </div>

        {/* Characters Grid */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayCharacters.map((character) => (
              <CharacterCardItem
                key={character.id}
                character={character}
                onClick={() => actions.selectCharacter(character)}
                isSelected={state.selectedCharacter?.id === character.id}
              />
            ))}
          </div>

          {displayCharacters.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64">
              <span className="text-6xl mb-4">👥</span>
              <p className="text-[var(--text-secondary)]">No characters found</p>
            </div>
          )}
        </div>

        {/* Character Detail Modal */}
        {state.selectedCharacter && (
          <CharacterDetailModal
            character={state.selectedCharacter}
            onClose={() => actions.selectCharacter(null)}
            onLevelUp={() => actions.levelUp(state.selectedCharacter!.id)}
            onEvolve={() => actions.evolve(state.selectedCharacter!.id)}
            onUnlock={() => actions.unlock(state.selectedCharacter!.id)}
            loading={state.loading}
          />
        )}

        {/* Error Toast */}
        {state.error && (
          <div className="fixed bottom-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            {state.error}
            <button onClick={() => actions.setError(null)} className="ml-2">✕</button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

interface CharacterCardItemProps {
  character: Character;
  onClick: () => void;
  isSelected: boolean;
}

function CharacterCardItem({ character, onClick, isSelected }: CharacterCardItemProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer 
        transition-all duration-300 border-2
        ${rarityColors[character.rarity]}
        ${isSelected ? "scale-105 shadow-lg" : "hover:scale-102"}
        ${!character.isOwned ? "opacity-60 grayscale-[50%]" : ""}
      `}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl opacity-30">{classIcons[character.characterClass]}</span>
        </div>
      </div>

      {/* Element Badge */}
      <div className="absolute top-2 left-2 text-xl">
        {elementIcons[character.element]}
      </div>

      {/* Stars */}
      <div className="absolute top-2 right-2 text-yellow-400 text-xs">
        {"★".repeat(character.stars)}
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-sm font-bold text-white truncate">{character.name}</p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-[var(--color-secondary)]">Lv.{character.level}</span>
          <span className="text-xs text-[var(--color-primary)]">⚔️{character.power.toLocaleString()}</span>
        </div>
      </div>

      {/* Lock Overlay */}
      {!character.isOwned && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="text-3xl">🔒</span>
        </div>
      )}
    </div>
  );
}

interface CharacterDetailModalProps {
  character: Character;
  onClose: () => void;
  onLevelUp: () => void;
  onEvolve: () => void;
  onUnlock: () => void;
  loading: boolean;
}

function CharacterDetailModal({ 
  character, 
  onClose, 
  onLevelUp, 
  onEvolve, 
  onUnlock,
  loading 
}: CharacterDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="game-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gradient-primary">{character.name}</h2>
            <p className="text-sm text-[var(--text-secondary)] capitalize">
              {character.rarity} • {character.element} • {character.characterClass}
            </p>
          </div>
          <button onClick={onClose} className="text-2xl text-[var(--text-muted)] hover:text-white">✕</button>
        </div>

        {/* Character Display */}
        <div className={`relative aspect-video rounded-lg overflow-hidden mb-4 border-2 ${rarityColors[character.rarity]}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center">
            <span className="text-8xl">{classIcons[character.characterClass]}</span>
          </div>
          <div className="absolute top-3 left-3 text-3xl">{elementIcons[character.element]}</div>
          <div className="absolute top-3 right-3 text-yellow-400">{"★".repeat(character.stars)}</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatItem label="Level" value={`${character.level} / ${character.maxLevel}`} icon="📊" />
          <StatItem label="Power" value={character.power.toLocaleString()} icon="⚔️" />
          <StatItem label="HP" value={character.hp.toLocaleString()} icon="❤️" />
          <StatItem label="Attack" value={character.attack.toLocaleString()} icon="🗡️" />
          <StatItem label="Defense" value={character.defense.toLocaleString()} icon="🛡️" />
          <StatItem label="Speed" value={character.speed.toString()} icon="💨" />
        </div>

        {/* Fragments Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[var(--text-secondary)]">Fragments</span>
            <span className="text-[var(--text-primary)]">{character.fragments} / {character.fragmentsRequired}</span>
          </div>
          <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
              style={{ width: `${Math.min(100, (character.fragments / character.fragmentsRequired) * 100)}%` }}
            />
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-2">Skills</h3>
          <div className="space-y-2">
            {character.skills.map((skill) => (
              <div key={skill.id} className="p-2 bg-[var(--bg-tertiary)] rounded-lg">
                <div className="flex justify-between">
                  <span className="font-bold text-sm">{skill.name}</span>
                  <span className="text-xs text-[var(--text-muted)]">CD: {skill.cooldown}s</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {character.isOwned ? (
            <>
              <GameButton
                variant="primary"
                fullWidth
                onClick={onLevelUp}
                disabled={loading || character.level >= character.maxLevel}
              >
                Level Up
              </GameButton>
              <GameButton
                variant="secondary"
                fullWidth
                onClick={onEvolve}
                disabled={loading || character.stars >= character.maxStars || character.fragments < character.fragmentsRequired}
              >
                Evolve ★
              </GameButton>
            </>
          ) : (
            <GameButton
              variant="primary"
              fullWidth
              onClick={onUnlock}
              disabled={loading || character.fragments < character.fragmentsRequired}
            >
              Unlock ({character.fragments}/{character.fragmentsRequired})
            </GameButton>
          )}
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="p-2 bg-[var(--bg-tertiary)] rounded-lg flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-xs text-[var(--text-muted)]">{label}</p>
        <p className="text-sm font-bold text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  );
}
