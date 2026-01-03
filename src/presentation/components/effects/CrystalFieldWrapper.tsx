"use client";

/**
 * CrystalFieldWrapper
 * Dynamic import wrapper for the Crystal Field 3D scene
 */

import dynamic from "next/dynamic";

const CrystalFieldScene = dynamic(
  () => import("./CrystalFieldScene").then((mod) => ({ default: mod.CrystalFieldScene })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#1a0a2e] to-[#2d1b4e]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            {/* Crystal loading animation */}
            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-2 border-4 border-cyan-400 border-b-transparent rounded-full animate-spin" style={{ animationDirection: "reverse" }} />
            <div className="absolute inset-4 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-purple-300 text-xl font-bold">Loading Crystal Field...</p>
          <p className="text-cyan-300/60 text-sm mt-2">Preparing your adventure</p>
        </div>
      </div>
    ),
  }
);

export function CrystalFieldWrapper() {
  return <CrystalFieldScene />;
}
