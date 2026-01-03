"use client";

/**
 * Crystal3DSceneWrapper
 * Dynamic import wrapper to prevent SSR issues with three.js
 */

import dynamic from "next/dynamic";

const Crystal3DScene = dynamic(
  () =>
    import("./Crystal3DScene").then((mod) => ({ default: mod.Crystal3DScene })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-6xl animate-pulse">🔮</div>
      </div>
    ),
  }
);

interface Crystal3DSceneWrapperProps {
  className?: string;
}

export function Crystal3DSceneWrapper({
  className = "",
}: Crystal3DSceneWrapperProps) {
  return <Crystal3DScene className={className} />;
}
