"use client";

import { useEffect, useState } from "react";
import { animated, config, useSpring } from "react-spring";

interface Bubble {
  id: number;
  size: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
}

interface CrystalBubbleAnimationProps {
  count?: number;
  className?: string;
}

/**
 * CrystalBubbleAnimation
 * Floating crystal bubbles with react-spring animations
 */
export function CrystalBubbleAnimation({
  count = 15,
  className = "",
}: CrystalBubbleAnimationProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Generate random bubbles
    const generatedBubbles: Bubble[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 20, // 20-80px
      left: Math.random() * 100, // 0-100%
      top: Math.random() * 100, // 0-100%
      delay: Math.random() * 2000, // 0-2s delay
      duration: Math.random() * 4000 + 4000, // 4-8s duration
    }));
    setBubbles(generatedBubbles);
  }, [count]);

  return (
    <div className={`crystal-bubble-container ${className}`}>
      {bubbles.map((bubble) => (
        <CrystalBubble key={bubble.id} bubble={bubble} />
      ))}
    </div>
  );
}

interface CrystalBubbleProps {
  bubble: Bubble;
}

function CrystalBubble({ bubble }: CrystalBubbleProps) {
  const [flip, setFlip] = useState(false);

  const props = useSpring({
    from: {
      transform: "translateY(0px) rotate(0deg)",
      opacity: 0.3,
    },
    to: {
      transform: flip 
        ? "translateY(-30px) rotate(10deg)" 
        : "translateY(0px) rotate(0deg)",
      opacity: flip ? 0.6 : 0.3,
    },
    config: { ...config.gentle, duration: bubble.duration },
    delay: bubble.delay,
    loop: true,
    reverse: true,
    onRest: () => setFlip(!flip),
  });

  return (
    <animated.div
      style={{
        ...props,
        position: "absolute",
        width: bubble.size,
        height: bubble.size,
        left: `${bubble.left}%`,
        top: `${bubble.top}%`,
        borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, 
          rgba(0, 212, 255, 0.4), 
          rgba(0, 150, 200, 0.15), 
          rgba(0, 100, 150, 0.05))`,
        border: "1px solid rgba(0, 212, 255, 0.3)",
        boxShadow: "inset 0 0 20px rgba(0, 212, 255, 0.2), 0 0 10px rgba(0, 212, 255, 0.1)",
        pointerEvents: "none",
      }}
    />
  );
}
