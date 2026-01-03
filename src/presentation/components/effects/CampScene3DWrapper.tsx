"use client";

/**
 * CampScene3DWrapper
 * Dynamic import wrapper to prevent SSR issues with three.js and rapier
 */

import dynamic from "next/dynamic";
import type { CharacterConfig } from "./PixelCharacter";

const CampScene3D = dynamic(
  () => import("./CampScene3D").then((mod) => ({ default: mod.CampScene3D })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#0a1628]">
        <div className="text-center">
          <div className="text-6xl animate-pulse mb-4">🏕️</div>
          <p className="text-[var(--text-secondary)]">Loading camp...</p>
        </div>
      </div>
    ),
  }
);

interface CampScene3DWrapperProps {
  team?: CharacterConfig[];
  selectedCharacterId?: string;
  onCharacterClick?: (id: string) => void;
  className?: string;
}

export function CampScene3DWrapper({
  team,
  selectedCharacterId,
  onCharacterClick,
  className = "",
}: CampScene3DWrapperProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <CampScene3D
        team={team}
        selectedCharacterId={selectedCharacterId}
        onCharacterClick={onCharacterClick}
      />
    </div>
  );
}

// Re-export CharacterConfig type
export type { CharacterConfig };
