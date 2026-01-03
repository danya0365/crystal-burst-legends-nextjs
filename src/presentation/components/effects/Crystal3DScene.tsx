"use client";

/**
 * Crystal3DScene
 * 3D floating crystal with particles using react-three-fiber
 * Uses dynamic import on client to prevent SSR issues
 */

import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Group, Mesh } from "three";

interface Crystal3DSceneProps {
  className?: string;
}

function FloatingCrystal() {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Slow rotation
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Main Crystal */}
        <mesh ref={meshRef} scale={1.5}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#00d4ff"
            emissive="#0066ff"
            emissiveIntensity={0.3}
            roughness={0.1}
            metalness={0.9}
            distort={0.2}
            speed={2}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Inner glow */}
        <mesh scale={1.2}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            color="#00d4ff"
            transparent
            opacity={0.15}
          />
        </mesh>
      </Float>

      {/* Sparkles around crystal */}
      <Sparkles
        count={60}
        size={2}
        scale={5}
        speed={0.5}
        color="#00d4ff"
      />
    </group>
  );
}

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      <directionalLight position={[0, 5, 0]} intensity={0.5} />

      {/* Crystal */}
      <FloatingCrystal />
    </>
  );
}

export function Crystal3DScene({ className = "" }: Crystal3DSceneProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
