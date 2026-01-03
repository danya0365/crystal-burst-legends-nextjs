"use client";

/**
 * CampScene3D
 * Complete 3D camping scene with pixel art characters, environment, and physics
 */

import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import {
    PixelCampfire,
    PixelGround,
    PixelLogBench,
    PixelMushroom,
    PixelRock,
    PixelTent,
    PixelTree,
} from "./PixelCampScene";
import { PixelCharacter, type CharacterConfig } from "./PixelCharacter";

// Default team configuration
const DEFAULT_TEAM: CharacterConfig[] = [
  {
    id: "1",
    name: "Arthur",
    type: "warrior",
    position: [-1.2, 0, 0.8],
    color: "#4A5568",
    accentColor: "#1A202C",
  },
  {
    id: "2",
    name: "Merlin",
    type: "mage",
    position: [1.2, 0, 0.8],
    color: "#5B21B6",
    accentColor: "#7C3AED",
  },
  {
    id: "3",
    name: "Robin",
    type: "archer",
    position: [-0.8, 0, -1],
    color: "#065F46",
    accentColor: "#047857",
  },
  {
    id: "4",
    name: "Clara",
    type: "healer",
    position: [0.8, 0, -1],
    color: "#FAFAFA",
    accentColor: "#FCD34D",
  },
  {
    id: "5",
    name: "Shadow",
    type: "rogue",
    position: [0, 0, 1.5],
    color: "#1F2937",
    accentColor: "#374151",
  },
];

interface CampScene3DProps {
  team?: CharacterConfig[];
  selectedCharacterId?: string;
  onCharacterClick?: (id: string) => void;
}

function Scene({ team, selectedCharacterId }: CampScene3DProps) {
  const characters = team || DEFAULT_TEAM;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.5}
        color="#FFA500"
        castShadow
      />
      <hemisphereLight args={["#87CEEB", "#8B4513", 0.3]} />

      {/* Stars in the sky (night scene) */}
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade />

      {/* Sky color */}
      <color attach="background" args={["#0a1628"]} />
      <fog attach="fog" args={["#0a1628", 8, 25]} />

      <Physics gravity={[0, -9.81, 0]}>
        {/* Ground */}
        <PixelGround />

        {/* Campfire in center */}
        <PixelCampfire position={[0, 0, 0]} />

        {/* Log benches around campfire */}
        <PixelLogBench position={[-0.8, 0.1, 0.6]} rotation={Math.PI / 4} />
        <PixelLogBench position={[0.8, 0.1, 0.6]} rotation={-Math.PI / 4} />
        <PixelLogBench position={[0, 0.1, -0.8]} rotation={0} />

        {/* Team Characters */}
        {characters.map((char) => (
          <PixelCharacter
            key={char.id}
            config={char}
            isSelected={char.id === selectedCharacterId}
          />
        ))}

        {/* Tents */}
        <PixelTent position={[-3, 0, -2]} color="#8B4513" />
        <PixelTent position={[3, 0, -2]} color="#654321" />
        <PixelTent position={[0, 0, -3.5]} color="#A0522D" />

        {/* Trees - Forest surrounding the camp */}
        {/* Back trees */}
        <PixelTree position={[-4, 0, -4]} variant="pine" scale={1.2} />
        <PixelTree position={[-2, 0, -5]} variant="oak" scale={1} />
        <PixelTree position={[0, 0, -5.5]} variant="pine" scale={1.5} />
        <PixelTree position={[2, 0, -5]} variant="birch" scale={1} />
        <PixelTree position={[4, 0, -4]} variant="pine" scale={1.3} />

        {/* Side trees */}
        <PixelTree position={[-5, 0, -2]} variant="pine" scale={1.1} />
        <PixelTree position={[-5.5, 0, 0]} variant="oak" scale={0.9} />
        <PixelTree position={[-5, 0, 2]} variant="pine" scale={1.2} />
        <PixelTree position={[5, 0, -2]} variant="birch" scale={1} />
        <PixelTree position={[5.5, 0, 0]} variant="pine" scale={1.1} />
        <PixelTree position={[5, 0, 2]} variant="oak" scale={0.9} />

        {/* Front trees (sparse) */}
        <PixelTree position={[-4, 0, 4]} variant="pine" scale={0.8} />
        <PixelTree position={[4, 0, 4]} variant="birch" scale={0.9} />

        {/* Rocks scattered around */}
        <PixelRock position={[-2, 0, 1.5]} scale={1.2} />
        <PixelRock position={[2.5, 0, 1]} scale={0.8} />
        <PixelRock position={[-1.5, 0, -2.5]} scale={1} />
        <PixelRock position={[1.8, 0, -2.8]} scale={0.6} />

        {/* Mushrooms */}
        <PixelMushroom position={[-3.5, 0, 1]} />
        <PixelMushroom position={[3.2, 0, -1.5]} />
        <PixelMushroom position={[-2.8, 0, -1.8]} />
        <PixelMushroom position={[4, 0, 0.5]} />
      </Physics>

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={12}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        target={[0, 0.5, 0]}
      />
    </>
  );
}

export function CampScene3D(props: CampScene3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [5, 4, 5], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
