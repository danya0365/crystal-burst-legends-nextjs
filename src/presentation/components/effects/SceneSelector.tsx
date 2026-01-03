"use client";

/**
 * SceneSelector
 * Allows switching between different 3D scenes
 */

import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamic imports for all scenes
const CrystalFieldScene = dynamic(
  () => import("./CrystalFieldScene").then((mod) => ({ default: mod.CrystalFieldScene })),
  { ssr: false, loading: () => <SceneLoading name="Crystal Field" color="#7C3AED" /> }
);

const IndustrialCityScene = dynamic(
  () => import("./IndustrialCityScene").then((mod) => ({ default: mod.IndustrialCityScene })),
  { ssr: false, loading: () => <SceneLoading name="Industrial City" color="#FF6B00" /> }
);

const CampScene3D = dynamic(
  () => import("./CampScene3D").then((mod) => ({ default: mod.CampScene3D })),
  { ssr: false, loading: () => <SceneLoading name="Camping" color="#22C55E" /> }
);

// Scene loading component
function SceneLoading({ name, color }: { name: string; color: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e]">
      <div className="text-center">
        <div 
          className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: `${color} transparent transparent transparent` }}
        />
        <p className="text-white text-lg font-medium">Loading {name}...</p>
      </div>
    </div>
  );
}

export type SceneType = "crystal-field" | "industrial-city" | "camping";

export const SCENES: { id: SceneType; name: string; icon: string; color: string; description: string }[] = [
  { 
    id: "crystal-field", 
    name: "Crystal Field", 
    icon: "💎", 
    color: "#7C3AED",
    description: "Fantasy crystal towers with UFOs"
  },
  { 
    id: "industrial-city", 
    name: "Industrial City", 
    icon: "🏭", 
    color: "#FF6B00",
    description: "Modern industrial district (Daylight)"
  },
  { 
    id: "camping", 
    name: "Camp Site", 
    icon: "🏕️", 
    color: "#22C55E",
    description: "Cozy pixel art camping"
  },
];

interface SceneDisplayProps {
  currentScene: SceneType;
}

export function SceneDisplay({ currentScene }: SceneDisplayProps) {
  switch (currentScene) {
    case "crystal-field":
      return <CrystalFieldScene />;
    case "industrial-city":
      return <IndustrialCityScene />;
    case "camping":
      return <CampScene3D />;
    default:
      return <CrystalFieldScene />;
  }
}

interface SceneSwitcherProps {
  currentScene: SceneType;
  onSceneChange: (scene: SceneType) => void;
}

export function SceneSwitcher({ currentScene, onSceneChange }: SceneSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentSceneInfo = SCENES.find((s) => s.id === currentScene) || SCENES[0];

  return (
    <div className="relative pointer-events-auto">
      {/* Current scene button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 hover:bg-black/80 transition-colors shadow-lg"
      >
        <span className="text-xl">{currentSceneInfo.icon}</span>
        <span className="text-white font-medium hidden md:inline">{currentSceneInfo.name}</span>
        <span className="text-white/50">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden shadow-2xl z-50">
          {SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => {
                onSceneChange(scene.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                currentScene === scene.id ? "bg-white/20" : ""
              }`}
            >
              <span className="text-2xl">{scene.icon}</span>
              <div className="flex-1">
                <p className="text-white font-medium">{scene.name}</p>
                <p className="text-white/50 text-xs">{scene.description}</p>
              </div>
              {currentScene === scene.id && (
                <span className="text-green-400">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Legacy component for backward compatibility if needed, 
 * but HomeView should switch to using SceneDisplay and SceneSwitcher separately.
 */
export function SceneSelector({ defaultScene = "crystal-field", showSelector = true }: { defaultScene?: SceneType; showSelector?: boolean }) {
  const [currentScene, setCurrentScene] = useState<SceneType>(defaultScene);

  return (
    <div className="relative w-full h-full">
      <SceneDisplay currentScene={currentScene} />
      {showSelector && (
        <div className="absolute top-4 right-4 z-20">
          <SceneSwitcher currentScene={currentScene} onSceneChange={setCurrentScene} />
        </div>
      )}
    </div>
  );
}
