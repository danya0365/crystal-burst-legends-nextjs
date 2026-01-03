"use client";

/**
 * PixelCampScene
 * 3D Pixel art camping scene with forest environment
 */

import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import type { Mesh, PointLight } from "three";

/**
 * Pixel Art Tree Component
 */
interface PixelTreeProps {
  position: [number, number, number];
  scale?: number;
  variant?: "pine" | "oak" | "birch";
}

export function PixelTree({ position, scale = 1, variant = "pine" }: PixelTreeProps) {
  const pixelSize = 0.15 * scale;

  const trunkColor = variant === "birch" ? "#F5F5DC" : "#8B4513";
  const leafColor = variant === "oak" ? "#228B22" : variant === "birch" ? "#90EE90" : "#006400";

  return (
    <RigidBody type="fixed" position={position} colliders="cuboid">
      <group>
        {/* Trunk */}
        <mesh position={[0, 0.5 * scale, 0]}>
          <boxGeometry args={[pixelSize * 2, pixelSize * 8, pixelSize * 2]} />
          <meshStandardMaterial color={trunkColor} />
        </mesh>

        {variant === "pine" ? (
          /* Pine tree - layered triangular */
          <>
            <mesh position={[0, 1.2 * scale, 0]}>
              <coneGeometry args={[0.5 * scale, 0.8 * scale, 4]} />
              <meshStandardMaterial color={leafColor} flatShading />
            </mesh>
            <mesh position={[0, 1.7 * scale, 0]}>
              <coneGeometry args={[0.4 * scale, 0.7 * scale, 4]} />
              <meshStandardMaterial color={leafColor} flatShading />
            </mesh>
            <mesh position={[0, 2.1 * scale, 0]}>
              <coneGeometry args={[0.3 * scale, 0.5 * scale, 4]} />
              <meshStandardMaterial color={leafColor} flatShading />
            </mesh>
          </>
        ) : (
          /* Oak/Birch - rounded top */
          <mesh position={[0, 1.3 * scale, 0]}>
            <boxGeometry args={[pixelSize * 8, pixelSize * 8, pixelSize * 8]} />
            <meshStandardMaterial color={leafColor} />
          </mesh>
        )}
      </group>
    </RigidBody>
  );
}

/**
 * Campfire Component with animated flames
 */
export function PixelCampfire({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (flameRef.current) {
      // Flickering flame animation
      flameRef.current.scale.y = 1 + Math.sin(timeRef.current * 10) * 0.2;
      flameRef.current.scale.x = 1 + Math.cos(timeRef.current * 8) * 0.1;
    }
    if (lightRef.current) {
      // Flickering light intensity
      lightRef.current.intensity = 2 + Math.sin(timeRef.current * 12) * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Stone ring */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 0.3,
            0.05,
            Math.sin((i / 8) * Math.PI * 2) * 0.3,
          ]}
        >
          <boxGeometry args={[0.12, 0.1, 0.12]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
      ))}

      {/* Wood logs */}
      <mesh position={[0, 0.08, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.4, 0.08, 0.08]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 0.08, 0]} rotation={[0, Math.PI / 2, Math.PI / 6]}>
        <boxGeometry args={[0.4, 0.08, 0.08]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Fire/Flames */}
      <mesh ref={flameRef} position={[0, 0.3, 0]}>
        <coneGeometry args={[0.15, 0.4, 6]} />
        <meshStandardMaterial
          color="#FF4500"
          emissive="#FF6600"
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Inner flame */}
      <mesh position={[0, 0.35, 0]}>
        <coneGeometry args={[0.08, 0.25, 6]} />
        <meshStandardMaterial
          color="#FFFF00"
          emissive="#FFD700"
          emissiveIntensity={3}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Fire light */}
      <pointLight
        ref={lightRef}
        position={[0, 0.5, 0]}
        color="#FF6600"
        intensity={2}
        distance={5}
        decay={2}
      />
    </group>
  );
}

/**
 * Pixel Art Tent Component
 */
export function PixelTent({ position, color = "#8B4513" }: { position: [number, number, number]; color?: string }) {
  return (
    <RigidBody type="fixed" position={position} colliders="cuboid">
      <group>
        {/* Tent body - triangular prism using boxes */}
        <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.6, 0.8, 4]} />
          <meshStandardMaterial color={color} flatShading />
        </mesh>
        {/* Tent opening */}
        <mesh position={[0, 0.2, 0.35]}>
          <boxGeometry args={[0.3, 0.4, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    </RigidBody>
  );
}

/**
 * Ground/Terrain Component
 */
export function PixelGround() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <group>
        {/* Main grass ground */}
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <boxGeometry args={[15, 0.2, 15]} />
          <meshStandardMaterial color="#2E8B57" />
        </mesh>

        {/* Dirt patches */}
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <cylinderGeometry args={[2, 2, 0.05, 8]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>

        {/* Random grass tufts */}
        {Array.from({ length: 30 }, (_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 12,
              0.05,
              (Math.random() - 0.5) * 12,
            ]}
          >
            <boxGeometry args={[0.05, 0.15, 0.05]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        ))}
      </group>
    </RigidBody>
  );
}

/**
 * Rock Component
 */
export function PixelRock({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <RigidBody type="fixed" position={position} colliders="cuboid">
      <mesh>
        <boxGeometry args={[0.3 * scale, 0.2 * scale, 0.25 * scale]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
    </RigidBody>
  );
}

/**
 * Mushroom Component
 */
export function PixelMushroom({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.1, 6]} />
        <meshStandardMaterial color="#F5F5DC" />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.15, 0]}>
        <coneGeometry args={[0.08, 0.06, 6]} />
        <meshStandardMaterial color="#FF6347" />
      </mesh>
    </group>
  );
}

/**
 * Log bench Component
 */
export function PixelLogBench({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <RigidBody type="fixed" position={position} colliders="cuboid">
      <mesh rotation={[0, rotation, 0]}>
        <boxGeometry args={[0.8, 0.15, 0.2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </RigidBody>
  );
}
