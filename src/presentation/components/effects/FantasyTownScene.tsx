"use client";

/**
 * FantasyTownScene
 * A beautiful fantasy village scene using Kenney Fantasy Town Kit models
 */

import { Clone, OrbitControls, Sky, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

// Base path for Kenney Fantasy Town Kit models
const MODEL_BASE = "/kenney_fantasy-town-kit_2.0/Models/GLB format";

// Preload essential models
const MODELS_TO_PRELOAD = [
  `${MODEL_BASE}/wall-block.glb`,
  `${MODEL_BASE}/roof.glb`,
  `${MODEL_BASE}/tree.glb`,
  `${MODEL_BASE}/road.glb`,
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

// ========== Building Components ==========

function House({ position, rotation = 0, variant = 1 }: { position: [number, number, number]; rotation?: number; variant?: number }) {
  // Simple house made of walls and roof
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base walls */}
      <Model url={`${MODEL_BASE}/wall-block.glb`} position={[0, 0, 0]} />
      <Model url={`${MODEL_BASE}/wall-block.glb`} position={[1, 0, 0]} />
      <Model url={`${MODEL_BASE}/wall-block.glb`} position={[0, 0, 1]} rotation={[0, Math.PI / 2, 0]} />
      <Model url={`${MODEL_BASE}/wall-block.glb`} position={[1, 0, 1]} rotation={[0, Math.PI / 2, 0]} />
      
      {/* Second floor */}
      <Model url={`${MODEL_BASE}/wall-block.glb`} position={[0, 1, 0]} />
      <Model url={`${MODEL_BASE}/wall-block.glb`} position={[1, 1, 0]} />
      
      {/* Roof */}
      <Model url={`${MODEL_BASE}/roof.glb`} position={[0, 2, 0]} />
      <Model url={`${MODEL_BASE}/roof.glb`} position={[1, 2, 0]} />
      
      {/* Window/Door based on variant */}
      {variant === 1 && (
        <Model url={`${MODEL_BASE}/wall-window-shutters.glb`} position={[0.5, 0.5, -0.1]} />
      )}
    </group>
  );
}

function Stall({ position, rotation = 0, color = "green" }: { position: [number, number, number]; rotation?: number; color?: "green" | "red" }) {
  const filename = color === "red" ? "stall-red.glb" : "stall-green.glb";
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Model url={`${MODEL_BASE}/${filename}`} />
      <Model url={`${MODEL_BASE}/stall-bench.glb`} position={[0, 0, 0.8]} />
    </group>
  );
}

function Tree({ position, variant = "normal" }: { position: [number, number, number]; variant?: "normal" | "high" | "crooked" }) {
  let filename = "tree.glb";
  if (variant === "high") filename = "tree-high.glb";
  if (variant === "crooked") filename = "tree-crooked.glb";
  
  return <Model url={`${MODEL_BASE}/${filename}`} position={position} />;
}

function Fountain({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Model url={`${MODEL_BASE}/fountain-round.glb`} />
      <Model url={`${MODEL_BASE}/fountain-center.glb`} position={[0, 0.3, 0]} />
    </group>
  );
}

function Road({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return <Model url={`${MODEL_BASE}/road.glb`} position={position} rotation={[0, rotation, 0]} />;
}

function Fence({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return <Model url={`${MODEL_BASE}/fence.glb`} position={position} rotation={[0, rotation, 0]} />;
}

function Lantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Model url={`${MODEL_BASE}/lantern.glb`} />
      <pointLight position={[0, 1.5, 0]} color="#FFD700" intensity={0.5} distance={5} decay={2} />
    </group>
  );
}

function Well({ position }: { position: [number, number, number] }) {
  // Use rock as a well placeholder if well doesn't exist
  return <Model url={`${MODEL_BASE}/rock-large.glb`} position={position} />;
}

// ========== Ground ==========

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#4a7c3f" /> {/* Grass green */}
    </mesh>
  );
}

// ========== Main Scene Content ==========

function SceneContent() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight
        position={[20, 30, 10]}
        intensity={1.2}
        color="#fff5e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <hemisphereLight args={["#87CEEB", "#4a7c3f", 0.5]} />

      {/* Sky */}
      <Sky sunPosition={[100, 50, 100]} turbidity={8} rayleigh={2} />
      <color attach="background" args={["#87CEEB"]} />
      <fog attach="fog" args={["#87CEEB", 20, 80]} />

      {/* Ground */}
      <Ground />

      {/* ===== Town Layout ===== */}
      
      {/* Central Fountain */}
      <Fountain position={[0, 0, 0]} />

      {/* Roads around fountain */}
      <Road position={[0, 0, 2]} />
      <Road position={[0, 0, 3]} />
      <Road position={[0, 0, -2]} rotation={Math.PI} />
      <Road position={[0, 0, -3]} rotation={Math.PI} />
      <Road position={[2, 0, 0]} rotation={Math.PI / 2} />
      <Road position={[3, 0, 0]} rotation={Math.PI / 2} />
      <Road position={[-2, 0, 0]} rotation={-Math.PI / 2} />
      <Road position={[-3, 0, 0]} rotation={-Math.PI / 2} />

      {/* Houses */}
      <House position={[-5, 0, -5]} rotation={Math.PI / 4} variant={1} />
      <House position={[5, 0, -5]} rotation={-Math.PI / 4} variant={2} />
      <House position={[-6, 0, 3]} rotation={Math.PI / 2} variant={1} />
      <House position={[6, 0, 3]} rotation={-Math.PI / 2} variant={2} />
      <House position={[0, 0, -8]} rotation={0} variant={1} />

      {/* Market Stalls */}
      <Stall position={[-3, 0, 5]} rotation={0} color="green" />
      <Stall position={[0, 0, 5]} rotation={0} color="red" />
      <Stall position={[3, 0, 5]} rotation={0} color="green" />

      {/* Trees around the village */}
      <Tree position={[-8, 0, -8]} variant="high" />
      <Tree position={[8, 0, -8]} variant="high" />
      <Tree position={[-10, 0, 0]} variant="normal" />
      <Tree position={[10, 0, 0]} variant="normal" />
      <Tree position={[-8, 0, 8]} variant="crooked" />
      <Tree position={[8, 0, 8]} variant="crooked" />
      <Tree position={[0, 0, 10]} variant="high" />
      <Tree position={[-5, 0, 10]} variant="normal" />
      <Tree position={[5, 0, 10]} variant="normal" />

      {/* Fences */}
      <Fence position={[-4, 0, -3]} />
      <Fence position={[-5, 0, -3]} />
      <Fence position={[4, 0, -3]} />
      <Fence position={[5, 0, -3]} />

      {/* Lanterns */}
      <Lantern position={[-2, 0, 2]} />
      <Lantern position={[2, 0, 2]} />
      <Lantern position={[-2, 0, -2]} />
      <Lantern position={[2, 0, -2]} />

      {/* Rocks for decoration */}
      <Model url={`${MODEL_BASE}/rock-small.glb`} position={[-12, 0, 5]} />
      <Model url={`${MODEL_BASE}/rock-small.glb`} position={[12, 0, -5]} />
      <Model url={`${MODEL_BASE}/rock-large.glb`} position={[-10, 0, -10]} />

      {/* Camera Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={40}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 1, 0]}
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
      <meshStandardMaterial color="#4a7c3f" />
    </mesh>
  );
}

/**
 * Main exported component
 */
export function FantasyTownScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [15, 12, 15], fov: 50 }}
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
