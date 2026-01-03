"use client";

/**
 * PixelCharacter
 * 3D Pixel art character component with customizable appearance
 */

import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import type { Group } from "three";

export interface CharacterConfig {
  id: string;
  name: string;
  type: "warrior" | "mage" | "archer" | "healer" | "rogue";
  position: [number, number, number];
  color: string;
  accentColor: string;
}

// Character type configurations
const CHARACTER_CONFIGS = {
  warrior: {
    bodyColor: "#8B4513",
    armorColor: "#708090",
    weaponType: "sword",
  },
  mage: {
    bodyColor: "#4B0082",
    armorColor: "#9932CC",
    weaponType: "staff",
  },
  archer: {
    bodyColor: "#228B22",
    armorColor: "#556B2F",
    weaponType: "bow",
  },
  healer: {
    bodyColor: "#FFFFFF",
    armorColor: "#FFD700",
    weaponType: "staff",
  },
  rogue: {
    bodyColor: "#2F4F4F",
    armorColor: "#1C1C1C",
    weaponType: "daggers",
  },
};

interface PixelCharacterProps {
  config: CharacterConfig;
  isSelected?: boolean;
}

export function PixelCharacter({ config, isSelected = false }: PixelCharacterProps) {
  const groupRef = useRef<Group>(null);
  const timeRef = useRef(0);
  const typeConfig = CHARACTER_CONFIGS[config.type];

  // Idle animation - gentle bobbing
  useFrame((_, delta) => {
    if (groupRef.current) {
      timeRef.current += delta;
      // Gentle floating/bobbing animation
      groupRef.current.position.y = Math.sin(timeRef.current * 2) * 0.05;
      // Subtle rotation when selected
      if (isSelected) {
        groupRef.current.rotation.y += delta * 0.5;
      }
    }
  });

  const pixelSize = 0.1;

  return (
    <RigidBody type="fixed" position={config.position} colliders="cuboid">
      <group ref={groupRef}>
        {/* Body - Main torso */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[pixelSize * 4, pixelSize * 5, pixelSize * 2]} />
          <meshStandardMaterial color={config.color || typeConfig.bodyColor} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[pixelSize * 3, pixelSize * 3, pixelSize * 3]} />
          <meshStandardMaterial color="#FFDAB9" />
        </mesh>

        {/* Hair */}
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[pixelSize * 3.2, pixelSize * 1.5, pixelSize * 3.2]} />
          <meshStandardMaterial color={config.accentColor || "#4A4A4A"} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.08, 0.8, 0.16]}>
          <boxGeometry args={[pixelSize * 0.8, pixelSize * 0.8, pixelSize * 0.3]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.08, 0.8, 0.16]}>
          <boxGeometry args={[pixelSize * 0.8, pixelSize * 0.8, pixelSize * 0.3]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Left Arm */}
        <mesh position={[-0.3, 0.35, 0]}>
          <boxGeometry args={[pixelSize * 2, pixelSize * 4, pixelSize * 2]} />
          <meshStandardMaterial color="#FFDAB9" />
        </mesh>

        {/* Right Arm */}
        <mesh position={[0.3, 0.35, 0]}>
          <boxGeometry args={[pixelSize * 2, pixelSize * 4, pixelSize * 2]} />
          <meshStandardMaterial color="#FFDAB9" />
        </mesh>

        {/* Left Leg */}
        <mesh position={[-0.1, 0, 0]}>
          <boxGeometry args={[pixelSize * 2, pixelSize * 4, pixelSize * 2]} />
          <meshStandardMaterial color={typeConfig.armorColor} />
        </mesh>

        {/* Right Leg */}
        <mesh position={[0.1, 0, 0]}>
          <boxGeometry args={[pixelSize * 2, pixelSize * 4, pixelSize * 2]} />
          <meshStandardMaterial color={typeConfig.armorColor} />
        </mesh>

        {/* Weapon based on type */}
        {config.type === "warrior" && (
          <>
            {/* Sword */}
            <mesh position={[0.45, 0.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
              <boxGeometry args={[pixelSize * 1, pixelSize * 8, pixelSize * 0.5]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Shield */}
            <mesh position={[-0.45, 0.4, 0.1]}>
              <boxGeometry args={[pixelSize * 0.5, pixelSize * 5, pixelSize * 4]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
          </>
        )}

        {config.type === "mage" && (
          /* Staff */
          <mesh position={[0.45, 0.6, 0]}>
            <boxGeometry args={[pixelSize * 1, pixelSize * 12, pixelSize * 1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        )}

        {config.type === "archer" && (
          /* Bow */
          <mesh position={[0.45, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[pixelSize * 8, pixelSize * 1, pixelSize * 0.5]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        )}

        {config.type === "healer" && (
          /* Healing Staff with orb */
          <>
            <mesh position={[0.45, 0.6, 0]}>
              <boxGeometry args={[pixelSize * 1, pixelSize * 10, pixelSize * 1]} />
              <meshStandardMaterial color="#FFD700" />
            </mesh>
            <mesh position={[0.45, 1.2, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#00FF7F" emissive="#00FF7F" emissiveIntensity={0.5} />
            </mesh>
          </>
        )}

        {config.type === "rogue" && (
          /* Daggers */
          <>
            <mesh position={[0.35, 0.3, 0.15]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[pixelSize * 0.5, pixelSize * 4, pixelSize * 0.3]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[-0.35, 0.3, 0.15]} rotation={[0, 0, -Math.PI / 4]}>
              <boxGeometry args={[pixelSize * 0.5, pixelSize * 4, pixelSize * 0.3]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
            </mesh>
          </>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.4, 16]} />
            <meshBasicMaterial color="#00FF00" transparent opacity={0.7} />
          </mesh>
        )}

        {/* Name tag */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.4, 0.1, 0.02]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.7} />
        </mesh>
      </group>
    </RigidBody>
  );
}
