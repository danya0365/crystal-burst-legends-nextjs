"use client";

/**
 * GLTFModels
 * Component for loading and displaying GLTF/GLB 3D models
 * Uses free CC0 models from Poly.pizza CDN
 */

import { Clone, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Group } from "three";
import * as THREE from "three";

// Free CC0 model URLs from various sources
// These are low-poly models suitable for game environments
export const MODEL_URLS = {
  // Characters - from Poly.pizza / Quaternius style
  knight: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/korrigan-hat/model.gltf",
  adventurer: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bear/model.gltf",
  
  // Environment
  tree_pine: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-spruce/model.gltf",
  tree_beech: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-beech/model.gltf",
  tree_lime: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-lime/model.gltf",
  
  // Props
  campfire: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/campfire/model.gltf",
  tent: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tent/model.gltf",
  log: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/log/model.gltf", 
  rock_small: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/rock-small/model.gltf",
  mushroom: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/mushroom/model.gltf",
};

// Preload all models for better performance
Object.values(MODEL_URLS).forEach((url) => {
  useGLTF.preload(url);
});

interface GLTFModelProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  animate?: boolean;
  animationType?: "bob" | "rotate" | "none";
}

/**
 * Generic GLTF Model Loader
 */
export function GLTFModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  animate = false,
  animationType = "bob",
}: GLTFModelProps) {
  const groupRef = useRef<Group>(null);
  const timeRef = useRef(Math.random() * 10);
  const { scene } = useGLTF(url);

  // Animation
  useFrame((_, delta) => {
    if (animate && groupRef.current) {
      timeRef.current += delta;
      if (animationType === "bob") {
        groupRef.current.position.y = position[1] + Math.sin(timeRef.current * 2) * 0.05;
      } else if (animationType === "rotate") {
        groupRef.current.rotation.y += delta * 0.5;
      }
    }
  });

  const scaleArray: [number, number, number] = Array.isArray(scale) 
    ? scale 
    : [scale, scale, scale];

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scaleArray}>
      <Clone object={scene} />
    </group>
  );
}

/**
 * Pine Tree Model
 */
export function PineTreeModel({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <GLTFModel
      url={MODEL_URLS.tree_pine}
      position={position}
      scale={scale * 0.5}
    />
  );
}

/**
 * Beech Tree Model
 */
export function BeechTreeModel({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <GLTFModel
      url={MODEL_URLS.tree_beech}
      position={position}
      scale={scale * 0.5}
    />
  );
}

/**
 * Campfire Model with light
 */
export function CampfireModel({
  position,
}: {
  position: [number, number, number];
}) {
  const lightRef = useRef<THREE.PointLight>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(timeRef.current * 12) * 0.5;
    }
  });

  return (
    <group position={position}>
      <GLTFModel url={MODEL_URLS.campfire} scale={0.8} />
      <pointLight
        ref={lightRef}
        position={[0, 0.5, 0]}
        color="#FF6600"
        intensity={2}
        distance={6}
        decay={2}
      />
    </group>
  );
}

/**
 * Tent Model
 */
export function TentModel({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <GLTFModel
      url={MODEL_URLS.tent}
      position={position}
      rotation={[0, rotation, 0]}
      scale={0.8}
    />
  );
}

/**
 * Log Model for benches
 */
export function LogModel({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <GLTFModel
      url={MODEL_URLS.log}
      position={position}
      rotation={[0, rotation, 0]}
      scale={0.5}
    />
  );
}

/**
 * Rock Model
 */
export function RockModel({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <GLTFModel
      url={MODEL_URLS.rock_small}
      position={position}
      scale={scale * 0.5}
    />
  );
}

/**
 * Mushroom Model
 */
export function MushroomModel({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <GLTFModel
      url={MODEL_URLS.mushroom}
      position={position}
      scale={0.3}
    />
  );
}

/**
 * Character Model with animation
 */
export function CharacterModel({
  position,
  color,
  isSelected = false,
}: {
  position: [number, number, number];
  color?: string;
  isSelected?: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const timeRef = useRef(Math.random() * 10);
  const { scene } = useGLTF(MODEL_URLS.knight);

  useFrame((_, delta) => {
    if (groupRef.current) {
      timeRef.current += delta;
      // Idle bobbing
      groupRef.current.position.y = position[1] + Math.sin(timeRef.current * 2) * 0.03;
      if (isSelected) {
        groupRef.current.rotation.y += delta * 0.5;
      }
    }
  });

  // Clone and optionally modify materials
  useEffect(() => {
    if (color && groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          if (mat.color) {
            mat.color.set(color);
          }
        }
      });
    }
  }, [color]);

  return (
    <group ref={groupRef} position={position} scale={0.5}>
      <Clone object={scene} />
      {isSelected && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1, 16]} />
          <meshBasicMaterial color="#22C55E" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}
