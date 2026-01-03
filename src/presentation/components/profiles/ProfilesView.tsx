"use client";

import { PlayerProfile, useProfileStore } from "@/src/infrastructure/stores/useProfileStore";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { ThemeToggle } from "@/src/presentation/components/common/ThemeToggle";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { ProfilesViewModel } from "@/src/presentation/presenters/profiles/ProfilesPresenter";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProfilesViewProps {
  initialViewModel?: ProfilesViewModel;
}

export function ProfilesView({ initialViewModel }: ProfilesViewProps) {
  const router = useRouter();
  const { profiles, activeProfileId, createProfile, switchProfile, deleteProfile } = useProfileStore();
  const [mounted, setMounted] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState("🎮");
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const avatars = initialViewModel?.avatars || ["🎮", "👑", "🔥", "⚡", "🌟", "💎", "🐉", "🦁", "🎯", "🏆", "⚔️", "🛡️"];

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }

  const handleCreate = () => {
    if (!newName.trim()) {
      setError("Please enter a name");
      return;
    }
    if (newName.trim().length < 3) {
      setError("Name must be at least 3 characters");
      return;
    }
    createProfile(newName.trim(), newAvatar);
    setShowCreate(false);
    setNewName("");
    setNewAvatar("🎮");
    setError("");
  };

  const handleSelect = (id: string) => {
    switchProfile(id);
    router.push("/game");
  };

  const handleDelete = (id: string) => {
    deleteProfile(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[var(--bg-primary)]">
      <CrystalBubbleAnimation count={12} />

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur-lg">
        <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-2">
          ← <span className="hidden sm:inline">Back to Home</span>
        </Link>
        <h1 className="text-xl font-bold text-gradient-primary">Select Profile</h1>
        <ThemeToggle />
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto p-4 pb-8">
        {/* Profile List */}
        {profiles.length > 0 ? (
          <div className="space-y-4 mb-8">
            <p className="text-sm text-[var(--text-muted)]">{profiles.length} profile(s) found</p>
            {profiles.map((profile: PlayerProfile) => (
              <div
                key={profile.id}
                className={`game-card p-4 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all ${
                  activeProfileId === profile.id ? "ring-2 ring-[var(--color-primary)]" : ""
                }`}
                onClick={() => handleSelect(profile.id)}
              >
                <span className="text-4xl">{profile.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[var(--text-primary)] truncate">{profile.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Created {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {activeProfileId === profile.id && (
                  <span className="text-xs bg-[var(--color-primary)] text-white px-2 py-1 rounded shrink-0">Active</span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteConfirm(profile.id); }}
                  className="text-red-400 hover:text-red-300 p-2 shrink-0"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-8">
            <span className="text-6xl mb-4 block">👤</span>
            <p className="text-[var(--text-secondary)]">No profiles yet</p>
            <p className="text-sm text-[var(--text-muted)]">Create your first profile to start playing</p>
          </div>
        )}

        {/* Create Button */}
        {!showCreate && (
          <GameButton variant="primary" fullWidth onClick={() => setShowCreate(true)}>
            + Create New Profile
          </GameButton>
        )}

        {/* Create Form */}
        {showCreate && (
          <div className="game-card p-6 mt-4">
            <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4">Create Profile</h3>
            
            {/* Avatar Selection */}
            <div className="mb-4">
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Avatar</label>
              <div className="grid grid-cols-6 gap-2">
                {avatars.map((av: string) => (
                  <button
                    key={av}
                    onClick={() => setNewAvatar(av)}
                    className={`text-2xl p-2 rounded-lg transition-all ${
                      newAvatar === av ? "bg-[var(--color-primary)] ring-2 ring-[var(--color-primary)] scale-110" : "bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)]"
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="mb-4">
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => { setNewName(e.target.value); setError(""); }}
                placeholder="Enter name..."
                maxLength={16}
                className="w-full p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1 text-right">{newName.length}/16</p>
              {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>

            {/* Preview */}
            <div className="mb-4 p-3 bg-[var(--bg-tertiary)] rounded-lg flex items-center gap-3">
              <span className="text-3xl">{newAvatar}</span>
              <div>
                <p className="text-xs text-[var(--text-muted)]">Preview</p>
                <p className="font-bold text-[var(--text-primary)]">{newName || "Your Name"}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <GameButton variant="ghost" fullWidth onClick={() => { setShowCreate(false); setError(""); }}>
                Cancel
              </GameButton>
              <GameButton variant="primary" fullWidth onClick={handleCreate}>
                Create
              </GameButton>
            </div>
          </div>
        )}

        {/* Quick Play with Active Profile */}
        {activeProfileId && profiles.length > 0 && !showCreate && (
          <div className="mt-6">
            <GameButton variant="secondary" fullWidth onClick={() => router.push("/game")}>
              Continue as {profiles.find((p: PlayerProfile) => p.id === activeProfileId)?.name} →
            </GameButton>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="game-card p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4">Delete Profile?</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              This action cannot be undone. All progress will be lost.
            </p>
            <div className="flex gap-3">
              <GameButton variant="ghost" fullWidth onClick={() => setDeleteConfirm(null)}>
                Cancel
              </GameButton>
              <GameButton variant="danger" fullWidth onClick={() => handleDelete(deleteConfirm)}>
                Delete
              </GameButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
