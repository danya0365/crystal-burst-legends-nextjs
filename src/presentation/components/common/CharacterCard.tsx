"use client";

type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

interface Character {
  id: string;
  name: string;
  level: number;
  rarity: Rarity;
  imageUrl?: string;
  power?: number;
}

interface CharacterCardProps {
  character: Character;
  onClick?: (character: Character) => void;
  showStats?: boolean;
}

const rarityLabels: Record<Rarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
  mythic: "Mythic",
};

/**
 * CharacterCard
 * Display character with portrait, rarity frame, and stats overlay
 */
export function CharacterCard({
  character,
  onClick,
  showStats = true,
}: CharacterCardProps) {
  const handleClick = () => {
    onClick?.(character);
  };

  return (
    <div
      className={`character-card rarity-${character.rarity}`}
      onClick={handleClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Character Image */}
      {character.imageUrl ? (
        <img
          src={character.imageUrl}
          alt={character.name}
          className="character-card-image"
        />
      ) : (
        <div className="character-card-image bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center">
          <span className="text-6xl opacity-30">👤</span>
        </div>
      )}

      {/* Overlay with info */}
      <div className="character-card-overlay">
        <div className="character-card-name">{character.name}</div>
        <div className="flex items-center justify-between mt-1">
          <span className="character-card-level">Lv. {character.level}</span>
          {showStats && character.power && (
            <span className="text-xs text-[var(--color-primary)]">
              ⚔️ {character.power.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Rarity Badge */}
      <div
        className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold
          ${character.rarity === "legendary" ? "bg-[var(--rarity-legendary)] text-black" : ""}
          ${character.rarity === "mythic" ? "bg-[var(--rarity-mythic)] text-white" : ""}
          ${character.rarity === "epic" ? "bg-[var(--rarity-epic)] text-white" : ""}
          ${character.rarity === "rare" ? "bg-[var(--rarity-rare)] text-black" : ""}
          ${character.rarity === "uncommon" ? "bg-[var(--rarity-uncommon)] text-black" : ""}
          ${character.rarity === "common" ? "bg-[var(--rarity-common)] text-black" : ""}
        `}
      >
        {rarityLabels[character.rarity]}
      </div>
    </div>
  );
}
