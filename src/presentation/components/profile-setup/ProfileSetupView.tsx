"use client";

import { useProfileStore } from "@/src/infrastructure/stores/useProfileStore";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AVATARS = ["🎮", "👑", "🔥", "⚡", "🌟", "💎", "🐉", "🦁", "🎯", "🏆", "⚔️", "🛡️"];

export function ProfileSetupView() {
  const router = useRouter();
  const { createProfile, hasProfile } = useProfileStore();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🎮");
  const [error, setError] = useState("");

  // If already has profile, redirect to game
  if (hasProfile) {
    router.replace("/game");
    return null;
  }

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters");
      return;
    }
    if (name.trim().length > 16) {
      setError("Name must be 16 characters or less");
      return;
    }
    
    createProfile(name.trim(), avatar);
    router.push("/game");
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
      <CrystalBubbleAnimation count={15} />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            Crystal Burst
          </h1>
          <h2 className="text-2xl font-bold text-gradient-secondary">
            Legends
          </h2>
          <p className="text-[var(--text-muted)] mt-2">Create your hero</p>
        </div>

        {/* Setup Card */}
        <div className="game-card p-6">
          {/* Avatar Selection */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-3">
              Choose Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  onClick={() => setAvatar(av)}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    avatar === av
                      ? "bg-[var(--color-primary)] scale-110 ring-2 ring-[var(--color-primary)]"
                      : "bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">
              Player Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="Enter your name..."
              maxLength={16}
              className="w-full p-4 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1 text-right">
              {name.length}/16
            </p>
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>

          {/* Preview */}
          <div className="mb-6 p-4 bg-[var(--bg-tertiary)] rounded-xl flex items-center gap-4">
            <span className="text-4xl">{avatar}</span>
            <div>
              <p className="text-[var(--text-muted)] text-xs">Preview</p>
              <p className="font-bold text-[var(--text-primary)]">
                {name || "Your Name"}
              </p>
            </div>
          </div>

          {/* Submit */}
          <GameButton
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            Start Adventure ⚔️
          </GameButton>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--text-muted)] mt-6">
          © 2026 Crystal Burst Legends
        </p>
      </div>
    </div>
  );
}
