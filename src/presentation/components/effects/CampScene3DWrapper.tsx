"use client";

/**
 * CampScene3DWrapper
 * Dynamic import wrapper for the 3D camping scene
 * Supports both pixel art and GLTF model versions
 */

import dynamic from "next/dynamic";
import type { CharacterConfig } from "./PixelCharacter";

// Dynamic import for GLTF version (better performance & visuals)
const CampSceneGLTF = dynamic(
  () => import("./CampSceneGLTF").then((mod) => ({ default: mod.CampSceneGLTF })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#0a1628] to-[#1a2f4a]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-300 text-lg font-medium">Loading 3D Models...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing your adventure</p>
        </div>
      </div>
    ),
  }
);

// Dynamic import for pixel art version (fallback)
const CampScene3D = dynamic(
  () => import("./CampScene3D").then((mod) => ({ default: mod.CampScene3D })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#0a1628] to-[#1a2f4a]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-300 text-lg">Loading camp...</p>
        </div>
      </div>
    ),
  }
);

interface CampScene3DWrapperProps {
  team?: CharacterConfig[];
  selectedCharacterId?: string;
  onCharacterClick?: (id: string) => void;
  /** Use GLTF models (better visuals) or pixel art (simpler) */
  useGLTF?: boolean;
}

export function CampScene3DWrapper({ 
  useGLTF = false, // Default to pixel art version since GLTF CDN may be unavailable
  ...props 
}: CampScene3DWrapperProps) {
  if (useGLTF) {
    return <CampSceneGLTF {...props} />;
  }
  return <CampScene3D {...props} />;
}

export type { CharacterConfig };
