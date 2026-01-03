"use client";

/**
 * CampSceneGLTF
 * Enhanced 3D camping scene using GLTF models for better visuals and performance
 */

import { Float, OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import {
    BeechTreeModel,
    CampfireModel,
    CharacterModel,
    LogModel,
    MushroomModel,
    PineTreeModel,
    RockModel,
    TentModel,
} from "./GLTFModels";
import type { CharacterConfig } from "./PixelCharacter";

// Default team configuration
const DEFAULT_TEAM: CharacterConfig[] = [
  { id: "1", name: "Arthur", type: "warrior", position: [-1.2, 0, 0.8], color: "#4A5568", accentColor: "#1A202C" },
  { id: "2", name: "Merlin", type: "mage", position: [1.2, 0, 0.8], color: "#5B21B6", accentColor: "#7C3AED" },
  { id: "3", name: "Robin", type: "archer", position: [-0.8, 0, -1], color: "#065F46", accentColor: "#047857" },
  { id: "4", name: "Clara", type: "healer", position: [0.8, 0, -1], color: "#FAFAFA", accentColor: "#FCD34D" },
  { id: "5", name: "Shadow", type: "rogue", position: [0, 0, 1.5], color: "#1F2937", accentColor: "#374151" },
];

interface CampSceneGLTFProps {
  team?: CharacterConfig[];
  selectedCharacterId?: string;
  onCharacterClick?: (id: string) => void;
}

/**
 * Ground plane
 */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <circleGeometry args={[15, 32]} />
      <meshStandardMaterial color="#3a5f0b" />
    </mesh>
  );
}

/**
 * Dirt area around campfire
 */
function DirtArea() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <circleGeometry args={[2.5, 16]} />
      <meshStandardMaterial color="#8B7355" />
    </mesh>
  );
}

function Scene({ team, selectedCharacterId }: CampSceneGLTFProps) {
  const characters = team || DEFAULT_TEAM;

  return (
    <>
      {/* Environment lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={0.3}
        color="#FFA500"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight args={["#87CEEB", "#3a5f0b", 0.3]} />

      {/* Night sky */}
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />
      <color attach="background" args={["#0a1628"]} />
      <fog attach="fog" args={["#0a1628", 10, 40]} />

      {/* Ground */}
      <Ground />
      <DirtArea />

      {/* Campfire in center with floating effect */}
      <Float speed={0.5} floatIntensity={0.1}>
        <CampfireModel position={[0, 0, 0]} />
      </Float>

      {/* Log benches */}
      <LogModel position={[-0.8, 0, 0.6]} rotation={Math.PI / 4} />
      <LogModel position={[0.8, 0, 0.6]} rotation={-Math.PI / 4} />
      <LogModel position={[0, 0, -0.8]} rotation={0} />

      {/* Team Characters */}
      {characters.map((char) => (
        <CharacterModel
          key={char.id}
          position={char.position}
          color={char.color}
          isSelected={char.id === selectedCharacterId}
        />
      ))}

      {/* Tents */}
      <TentModel position={[-3, 0, -2]} rotation={0.3} />
      <TentModel position={[3, 0, -2]} rotation={-0.3} />
      <TentModel position={[0, 0, -3.5]} rotation={Math.PI} />

      {/* Trees - Forest surrounding the camp */}
      {/* Back trees */}
      <PineTreeModel position={[-4, 0, -5]} scale={1.2} />
      <BeechTreeModel position={[-2, 0, -6]} scale={1} />
      <PineTreeModel position={[0, 0, -6.5]} scale={1.5} />
      <BeechTreeModel position={[2, 0, -6]} scale={1} />
      <PineTreeModel position={[4, 0, -5]} scale={1.3} />

      {/* Side trees - left */}
      <PineTreeModel position={[-5, 0, -3]} scale={1.1} />
      <BeechTreeModel position={[-6, 0, 0]} scale={0.9} />
      <PineTreeModel position={[-5.5, 0, 2]} scale={1.2} />
      <PineTreeModel position={[-4.5, 0, 4]} scale={0.8} />

      {/* Side trees - right */}
      <BeechTreeModel position={[5, 0, -3]} scale={1} />
      <PineTreeModel position={[6, 0, 0]} scale={1.1} />
      <BeechTreeModel position={[5.5, 0, 2]} scale={0.9} />
      <PineTreeModel position={[4.5, 0, 4]} scale={0.7} />

      {/* Front trees */}
      <PineTreeModel position={[-3, 0, 5]} scale={0.8} />
      <BeechTreeModel position={[3, 0, 5]} scale={0.9} />

      {/* Rocks */}
      <RockModel position={[-2, 0, 1.5]} scale={1.2} />
      <RockModel position={[2.5, 0, 1]} scale={0.8} />
      <RockModel position={[-1.5, 0, -2.5]} scale={1} />
      <RockModel position={[1.8, 0, -2.8]} scale={0.6} />

      {/* Mushrooms */}
      <MushroomModel position={[-3.5, 0, 1]} />
      <MushroomModel position={[3.2, 0, -1.5]} />
      <MushroomModel position={[-2.8, 0, -1.8]} />
      <MushroomModel position={[4, 0, 0.5]} />

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.3}
        target={[0, 0.5, 0]}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

/**
 * Loading fallback
 */
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  );
}

export function CampSceneGLTF(props: CampSceneGLTFProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [6, 5, 6], fov: 50 }}
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
