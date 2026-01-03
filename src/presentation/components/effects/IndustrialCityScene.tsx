"use client";

/**
 * IndustrialCityScene
 * A cyberpunk-style industrial city scene using Kenney City Kit Industrial models
 * Features factories, smokestacks, and a moody atmosphere
 */

import { Clone, OrbitControls, Sky, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Group, PointLight } from "three";

// Base path for Kenney models
const MODEL_BASE = "/kenney_city-kit-industrial_1.0/Models/GLB format";

// Preload essential models
const MODELS_TO_PRELOAD = [
  `${MODEL_BASE}/building-a.glb`,
  `${MODEL_BASE}/building-b.glb`,
  `${MODEL_BASE}/building-c.glb`,
  `${MODEL_BASE}/chimney-large.glb`,
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
 * Building with optional lighting
 */
function Building({ 
  position, 
  variant = "a", 
  scale = 1, 
  rotation = 0,
  hasLight = false 
}: { 
  position: [number, number, number]; 
  variant?: string;
  scale?: number;
  rotation?: number;
  hasLight?: boolean;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <Model url={`${MODEL_BASE}/building-${variant}.glb`} />
      {hasLight && (
        <pointLight 
          position={[0, 2, 0]} 
          color="#FF6B00" 
          intensity={0.5} 
          distance={4} 
          decay={2} 
        />
      )}
    </group>
  );
}

/**
 * Smoking Chimney with particle effect simulation
 */
function SmokingChimney({ position, size = "large" }: { position: [number, number, number]; size?: "basic" | "small" | "medium" | "large" }) {
  const smokeRef = useRef<Group>(null);
  const lightRef = useRef<PointLight>(null);
  const timeRef = useRef(Math.random() * 10);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (smokeRef.current) {
      // Simulated smoke rising effect
      smokeRef.current.position.y = 3 + Math.sin(timeRef.current * 2) * 0.1;
      smokeRef.current.rotation.y += delta * 0.3;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.3 + Math.sin(timeRef.current * 3) * 0.1;
    }
  });

  return (
    <group position={position}>
      <Model url={`${MODEL_BASE}/chimney-${size}.glb`} />
      {/* Simulated smoke glow */}
      <group ref={smokeRef}>
        <mesh>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#888888" transparent opacity={0.3} />
        </mesh>
      </group>
      {/* Fire glow at base */}
      <pointLight 
        ref={lightRef}
        position={[0, 0.5, 0]} 
        color="#FF4500" 
        intensity={0.3} 
        distance={3} 
        decay={2} 
      />
    </group>
  );
}

/**
 * Tank (storage tank)
 */
function Tank({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return <Model url={`${MODEL_BASE}/detail-tank.glb`} position={position} scale={scale} />;
}

/**
 * Ground Plane
 */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#1a1a2e" />
    </mesh>
  );
}

/**
 * Road
 */
function Road({ start, end, width = 1 }: { start: [number, number]; end: [number, number]; width?: number }) {
  const length = Math.sqrt((end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2);
  const angle = Math.atan2(end[1] - start[1], end[0] - start[0]);
  const centerX = (start[0] + end[0]) / 2;
  const centerZ = (start[1] + end[1]) / 2;

  return (
    <mesh rotation={[-Math.PI / 2, 0, angle]} position={[centerX, 0.01, centerZ]}>
      <planeGeometry args={[length, width]} />
      <meshStandardMaterial color="#555555" />
    </mesh>
  );
}

/**
 * Neon Sign Light
 */
function NeonLight({ position, color = "#00FFFF" }: { position: [number, number, number]; color?: string }) {
  const lightRef = useRef<PointLight>(null);
  const timeRef = useRef(Math.random() * 10);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (lightRef.current) {
      // Flickering neon effect
      lightRef.current.intensity = 0.8 + Math.sin(timeRef.current * 15) * 0.2;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={position}
      color={color}
      intensity={0.8}
      distance={6}
      decay={2}
    />
  );
}

/**
 * Main Scene Content
 */
function SceneContent() {
  return (
    <>
      {/* Daylight Industrial Lighting */}
      <ambientLight intensity={0.8} color="#ffffff" />
      <directionalLight
        position={[20, 30, 10]}
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <hemisphereLight args={["#87CEEB", "#f0f0f0", 0.8]} />

      {/* Bright Sky Background */}
      <color attach="background" args={["#87CEEB"]} />
      
      {/* Light Fog for depth */}
      <fog attach="fog" args={["#87CEEB", 15, 60]} />

      {/* Cloud-like environment (optional, using Sky component if available, or just clear blue sky) */}
      <Sky sunPosition={[100, 20, 100]} turbidity={10} rayleigh={2} mieCoefficient={0.005} mieDirectionalG={0.8} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#5c5c5c" />
      </mesh>

      {/* Roads */}
      <Road start={[-20, 0]} end={[20, 0]} width={2} />
      <Road start={[0, -20]} end={[0, 20]} width={2} />

      {/* Main Factory Complex - Center */}
      <Building position={[-3, 0, -3]} variant="a" scale={1} hasLight />
      <Building position={[3, 0, -3]} variant="b" scale={1} hasLight />
      <Building position={[-3, 0, 3]} variant="c" scale={0.9} />
      <Building position={[3, 0, 3]} variant="d" scale={0.9} hasLight />

      {/* Outer Buildings */}
      <Building position={[-8, 0, -6]} variant="e" scale={0.8} rotation={Math.PI / 4} />
      <Building position={[8, 0, -6]} variant="f" scale={0.8} rotation={-Math.PI / 4} />
      <Building position={[-8, 0, 6]} variant="g" scale={0.85} />
      <Building position={[8, 0, 6]} variant="h" scale={0.85} hasLight />
      
      {/* Additional buildings for depth */}
      <Building position={[-12, 0, 0]} variant="i" scale={0.7} />
      <Building position={[12, 0, 0]} variant="j" scale={0.7} />
      <Building position={[0, 0, -10]} variant="k" scale={0.8} />
      <Building position={[0, 0, 10]} variant="l" scale={0.8} hasLight />

      {/* Smokestacks */}
      <SmokingChimney position={[-5, 0, -5]} size="large" />
      <SmokingChimney position={[5, 0, -5]} size="large" />
      <SmokingChimney position={[-5, 0, 5]} size="medium" />
      <SmokingChimney position={[5, 0, 5]} size="medium" />
      <SmokingChimney position={[0, 0, -8]} size="small" />

      {/* Storage Tanks */}
      <Tank position={[-6, 0, 0]} scale={1.2} />
      <Tank position={[6, 0, 0]} scale={1.2} />
      <Tank position={[-10, 0, -8]} scale={0.8} />
      <Tank position={[10, 0, -8]} scale={0.8} />

      {/* Neon accent lights */}
      <NeonLight position={[-3, 3, -3]} color="#FF00FF" />
      <NeonLight position={[3, 3, -3]} color="#00FFFF" />
      <NeonLight position={[-3, 3, 3]} color="#FF6B00" />
      <NeonLight position={[3, 3, 3]} color="#00FF88" />

      {/* Camera Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={8}
        maxDistance={30}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 2, 0]}
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
      <meshStandardMaterial color="#0a0a1a" />
    </mesh>
  );
}

/**
 * Main exported component
 */
export function IndustrialCityScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [12, 10, 12], fov: 50 }}
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
