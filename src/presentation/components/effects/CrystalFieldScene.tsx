"use client";

/**
 * CrystalFieldScene
 * A beautiful 3D scene using Kenney Tower Defense Kit models
 * Features crystals, trees, tiles, towers, and enemies
 */

import { Clone, Float, OrbitControls, Stars, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import type { Group } from "three";

// Base path for Kenney models
const MODEL_BASE = "/kenney_tower-defense-kit/Models/GLB format";

// Preload essential models
const MODELS_TO_PRELOAD = [
  `${MODEL_BASE}/tile-straight.glb`,
  `${MODEL_BASE}/tile-crystal.glb`,
  `${MODEL_BASE}/detail-crystal.glb`,
  `${MODEL_BASE}/detail-tree.glb`,
  `${MODEL_BASE}/detail-rocks.glb`,
  `${MODEL_BASE}/tower-round-base.glb`,
  `${MODEL_BASE}/tower-round-crystals.glb`,
];

MODELS_TO_PRELOAD.forEach((url) => {
  useGLTF.preload(url);
});

/**
 * Generic GLB Model Component
 */
interface ModelProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

function Model({ url, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: ModelProps) {
  const { scene } = useGLTF(url);
  const scaleArray: [number, number, number] = Array.isArray(scale) ? scale : [scale, scale, scale];
  
  return (
    <group position={position} rotation={rotation} scale={scaleArray}>
      <Clone object={scene} />
    </group>
  );
}

/**
 * Glowing Crystal with animation
 */
function GlowingCrystal({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const groupRef = useRef<Group>(null);
  const timeRef = useRef(Math.random() * 10);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(timeRef.current * 0.5) * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(timeRef.current * 1.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <Model url={`${MODEL_BASE}/detail-crystal.glb`} />
      {/* Add glow effect */}
      <pointLight position={[0, 0.3, 0]} color="#00FFFF" intensity={0.5} distance={2} decay={2} />
    </group>
  );
}

/**
 * Large Glowing Crystal
 */
function LargeCrystal({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const groupRef = useRef<Group>(null);
  const timeRef = useRef(Math.random() * 10);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <Model url={`${MODEL_BASE}/detail-crystal-large.glb`} />
      <pointLight position={[0, 0.5, 0]} color="#FF00FF" intensity={1} distance={4} decay={2} />
    </group>
  );
}

/**
 * Tree model
 */
function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return <Model url={`${MODEL_BASE}/detail-tree.glb`} position={position} scale={scale} />;
}

/**
 * Large Tree model
 */
function LargeTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return <Model url={`${MODEL_BASE}/detail-tree-large.glb`} position={position} scale={scale} />;
}

/**
 * Rocks
 */
function Rocks({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return <Model url={`${MODEL_BASE}/detail-rocks.glb`} position={position} scale={scale} />;
}

/**
 * Crystal Tower
 */
function CrystalTower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Model url={`${MODEL_BASE}/tower-round-base.glb`} position={[0, 0, 0]} />
      <Model url={`${MODEL_BASE}/tower-round-crystals.glb`} position={[0, 0, 0]} />
      <pointLight position={[0, 1, 0]} color="#00FFFF" intensity={1.5} distance={5} decay={2} />
    </group>
  );
}

/**
 * Ground Tile
 */
function GroundTile({ position, type = "straight", rotation = 0 }: { 
  position: [number, number, number]; 
  type?: "straight" | "crystal" | "tree" | "dirt" | "rock" | "crossing";
  rotation?: number;
}) {
  const urls: Record<string, string> = {
    straight: `${MODEL_BASE}/tile-straight.glb`,
    crystal: `${MODEL_BASE}/tile-crystal.glb`,
    tree: `${MODEL_BASE}/tile-tree.glb`,
    dirt: `${MODEL_BASE}/tile-dirt.glb`,
    rock: `${MODEL_BASE}/tile-rock.glb`,
    crossing: `${MODEL_BASE}/tile-crossing.glb`,
  };
  
  return <Model url={urls[type]} position={position} rotation={[0, rotation, 0]} />;
}

/**
 * UFO Enemy with animation
 */
function UFOEnemy({ position, variant = "a" }: { position: [number, number, number]; variant?: "a" | "b" | "c" | "d" }) {
  const groupRef = useRef<Group>(null);
  const timeRef = useRef(Math.random() * 10);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      // Hovering animation
      groupRef.current.position.y = position[1] + Math.sin(timeRef.current * 2) * 0.15;
      // Slight wobble
      groupRef.current.rotation.z = Math.sin(timeRef.current * 1.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Model url={`${MODEL_BASE}/enemy-ufo-${variant}.glb`} />
      {/* UFO glow */}
      <pointLight position={[0, -0.3, 0]} color="#00FF00" intensity={0.8} distance={3} decay={2} />
    </group>
  );
}

/**
 * Grid of ground tiles
 */
function TileGrid() {
  const tiles = useMemo(() => {
    const result: { x: number; z: number; type: "straight" | "crystal" | "tree" | "rock" | "dirt" }[] = [];
    const gridSize = 5;
    const tileSize = 1; // Kenney tiles are typically 1 unit
    
    for (let x = -gridSize; x <= gridSize; x++) {
      for (let z = -gridSize; z <= gridSize; z++) {
        // Random tile types
        let type: "straight" | "crystal" | "tree" | "rock" | "dirt" = "straight";
        const rand = Math.random();
        if (rand < 0.15) type = "crystal";
        else if (rand < 0.25) type = "tree";
        else if (rand < 0.35) type = "rock";
        else if (rand < 0.45) type = "dirt";
        
        result.push({ x: x * tileSize, z: z * tileSize, type });
      }
    }
    return result;
  }, []);

  return (
    <group>
      {tiles.map((tile, i) => (
        <GroundTile
          key={i}
          position={[tile.x, 0, tile.z]}
          type={tile.type}
          rotation={Math.floor(Math.random() * 4) * (Math.PI / 2)}
        />
      ))}
    </group>
  );
}

/**
 * Main Scene Content
 */
function SceneContent() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.8}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight args={["#87CEEB", "#3a5f0b", 0.3]} />

      {/* Sky and atmosphere */}
      <Stars radius={100} depth={50} count={2500} factor={4} saturation={0.5} fade />
      <color attach="background" args={["#1a0a2e"]} />
      <fog attach="fog" args={["#1a0a2e", 8, 30]} />

      {/* Ground Tiles */}
      <TileGrid />

      {/* Central Large Crystal */}
      <Float speed={1} floatIntensity={0.2}>
        <LargeCrystal position={[0, 0.5, 0]} scale={1.5} />
      </Float>

      {/* Crystal Towers at corners */}
      <CrystalTower position={[-4, 0, -4]} />
      <CrystalTower position={[4, 0, -4]} />
      <CrystalTower position={[-4, 0, 4]} />
      <CrystalTower position={[4, 0, 4]} />

      {/* Scattered Crystals */}
      <GlowingCrystal position={[-2, 0.2, 1]} scale={0.8} />
      <GlowingCrystal position={[2, 0.2, -1]} scale={0.7} />
      <GlowingCrystal position={[1, 0.2, 2]} scale={0.9} />
      <GlowingCrystal position={[-1, 0.2, -2]} scale={0.6} />

      {/* Trees around the edges */}
      <LargeTree position={[-6, 0, -3]} scale={1.2} />
      <LargeTree position={[6, 0, -3]} scale={1} />
      <LargeTree position={[-6, 0, 3]} scale={1.1} />
      <LargeTree position={[6, 0, 3]} scale={0.9} />
      <Tree position={[-5, 0, 0]} scale={1} />
      <Tree position={[5, 0, 0]} scale={1} />
      <Tree position={[0, 0, 6]} scale={1.1} />
      <Tree position={[0, 0, -6]} scale={0.9} />

      {/* Rocks */}
      <Rocks position={[-3, 0, 3]} scale={1} />
      <Rocks position={[3, 0, -3]} scale={0.8} />
      <Rocks position={[-3, 0, -3]} scale={0.9} />
      <Rocks position={[3, 0, 3]} scale={1.1} />

      {/* UFO Enemies hovering */}
      <UFOEnemy position={[-2, 1.5, -2]} variant="a" />
      <UFOEnemy position={[2, 1.8, 2]} variant="b" />
      <UFOEnemy position={[0, 2, -3]} variant="c" />

      {/* Camera Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={20}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.3}
        target={[0, 0, 0]}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

/**
 * Loading component
 */
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#1a0a2e" />
    </mesh>
  );
}

/**
 * Main exported component
 */
export function CrystalFieldScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
