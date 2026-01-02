"use client";

import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { ProfileViewModel } from "@/src/presentation/presenters/profile/ProfilePresenter";
import { useProfilePresenter } from "@/src/presentation/presenters/profile/useProfilePresenter";
import { useState } from "react";

interface ProfileViewProps {
  initialViewModel?: ProfileViewModel;
}

const AVATARS = ["🎮", "👑", "🔥", "⚡", "🌟", "💎", "🐉", "🦁", "🎯", "🏆"];

export function ProfileView({ initialViewModel }: ProfileViewProps) {
  const [state, actions] = useProfilePresenter(initialViewModel);
  const [newName, setNewName] = useState("");
  const [showAvatars, setShowAvatars] = useState(false);
  const viewModel = state.viewModel;

  if (state.loading && !viewModel) {
    return (
      <MainLayout>
        <div className="relative w-full h-full flex items-center justify-center">
          <CrystalBubbleAnimation count={10} />
          <div className="text-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const profile = viewModel?.profile;
  const stats = viewModel?.stats;
  const expPercent = profile ? (profile.exp / profile.expToNextLevel) * 100 : 0;

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={6} />

        {/* Header Card */}
        <div className="relative z-10 p-4">
          <div className="game-card p-6 bg-gradient-to-br from-purple-900/50 to-blue-900/50">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAvatars(true)}
                className="text-5xl hover:scale-110 transition-transform"
              >
                {profile?.avatar}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {state.editing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="px-2 py-1 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded text-sm"
                        placeholder={profile?.name}
                      />
                      <GameButton size="sm" variant="primary" onClick={() => actions.updateName(newName || profile!.name)}>
                        ✓
                      </GameButton>
                      <GameButton size="sm" variant="ghost" onClick={() => actions.setEditing(false)}>
                        ✕
                      </GameButton>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-xl font-bold text-[var(--text-primary)]">{profile?.name}</h1>
                      <button onClick={() => { setNewName(profile?.name || ""); actions.setEditing(true); }} className="text-[var(--text-muted)]">✏️</button>
                    </>
                  )}
                </div>
                <p className="text-sm text-yellow-400">🎖️ {profile?.title}</p>
                {profile?.guildName && (
                  <p className="text-xs text-[var(--text-muted)]">⚔️ {profile.guildName}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gradient-primary">Lv.{profile?.level}</p>
                <p className="text-xs text-yellow-400">VIP {profile?.vipLevel}</p>
              </div>
            </div>
            {/* EXP Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-muted)]">EXP</span>
                <span className="text-[var(--text-secondary)]">{profile?.exp.toLocaleString()} / {profile?.expToNextLevel.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${expPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">📊 Statistics</h2>
          
          {/* Power */}
          <div className="game-card p-4 mb-4 text-center">
            <p className="text-[var(--text-muted)] text-sm">Total Power</p>
            <p className="text-3xl font-bold text-gradient-primary">{profile?.power.toLocaleString()}</p>
          </div>

          {/* Battle Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <StatCard label="Total Battles" value={stats?.totalBattles || 0} icon="⚔️" />
            <StatCard label="Win Rate" value={`${stats?.winRate || 0}%`} icon="🏆" />
            <StatCard label="Wins" value={stats?.wins || 0} icon="✅" color="text-green-400" />
            <StatCard label="Losses" value={stats?.losses || 0} icon="❌" color="text-red-400" />
          </div>

          {/* Collection Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Characters" value={stats?.charactersOwned || 0} icon="👥" />
            <StatCard label="Stages" value={stats?.stagesCleared || 0} icon="📍" />
            <StatCard label="Achievements" value={stats?.achievementsCompleted || 0} icon="🏅" />
          </div>

          {/* Highest Damage */}
          <div className="game-card p-4 mt-4 text-center">
            <p className="text-[var(--text-muted)] text-sm">Highest Damage</p>
            <p className="text-2xl font-bold text-red-400">💥 {stats?.highestDamage.toLocaleString()}</p>
          </div>

          {/* Member Since */}
          <p className="text-center text-xs text-[var(--text-muted)] mt-4">
            Member since {profile ? new Date(profile.joinedAt).toLocaleDateString() : "-"}
          </p>
        </div>

        {/* Avatar Picker Modal */}
        {showAvatars && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="game-card p-6 w-full max-w-sm">
              <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4">Choose Avatar</h3>
              <div className="grid grid-cols-5 gap-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => { actions.updateAvatar(avatar); setShowAvatars(false); }}
                    className={`text-3xl p-2 rounded-lg hover:bg-[var(--bg-tertiary)] ${profile?.avatar === avatar ? "bg-[var(--color-primary)]/20 ring-2 ring-[var(--color-primary)]" : ""}`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
              <GameButton variant="ghost" fullWidth className="mt-4" onClick={() => setShowAvatars(false)}>
                Cancel
              </GameButton>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function StatCard({ label, value, icon, color = "text-[var(--text-primary)]" }: { label: string; value: string | number; icon: string; color?: string }) {
  return (
    <div className="game-card p-3 text-center">
      <span className="text-xl">{icon}</span>
      <p className={`text-lg font-bold ${color}`}>{typeof value === "number" ? value.toLocaleString() : value}</p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
