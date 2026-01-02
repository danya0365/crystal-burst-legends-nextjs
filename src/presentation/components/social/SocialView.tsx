"use client";

import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { SocialViewModel } from "@/src/presentation/presenters/social/SocialPresenter";
import { useSocialPresenter } from "@/src/presentation/presenters/social/useSocialPresenter";
import { useState } from "react";

interface SocialViewProps {
  initialViewModel?: SocialViewModel;
}

const statusColors = {
  online: "bg-green-400",
  playing: "bg-blue-400",
  offline: "bg-gray-400",
};

export function SocialView({ initialViewModel }: SocialViewProps) {
  const [state, actions] = useSocialPresenter(initialViewModel);
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "search">("friends");
  const viewModel = state.viewModel;

  if (state.loading && !viewModel) {
    return (
      <MainLayout>
        <div className="relative w-full h-full flex items-center justify-center">
          <CrystalBubbleAnimation count={10} />
          <div className="text-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading friends...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const friends = viewModel?.friends || [];
  const requests = viewModel?.requests || [];
  const stats = viewModel?.stats;

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={6} />

        {/* Header */}
        <div className="relative z-10 p-4 border-b border-[var(--border-color)]">
          <h1 className="text-2xl font-bold text-gradient-primary">Social</h1>
          {stats && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {stats.friendsCount}/{stats.maxFriends} friends
              {stats.pendingRequests > 0 && (
                <span className="ml-2 text-yellow-400">• {stats.pendingRequests} pending</span>
              )}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="relative z-10 px-4 py-2 flex gap-2 border-b border-[var(--border-color)]">
          {(["friends", "requests", "search"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                activeTab === tab
                  ? "bg-[var(--color-primary)] text-black font-bold"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
              }`}
            >
              {tab === "friends" ? "👥 Friends" : tab === "requests" ? `📬 Requests ${requests.length > 0 ? `(${requests.length})` : ""}` : "🔍 Search"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4">
          {/* Friends Tab */}
          {activeTab === "friends" && (
            <div className="space-y-3">
              {/* Online friends first */}
              {friends.filter((f) => f.status !== "offline").map((friend) => (
                <FriendCard key={friend.id} friend={friend} onRemove={() => actions.removeFriend(friend.id)} />
              ))}
              {/* Offline friends */}
              {friends.filter((f) => f.status === "offline").map((friend) => (
                <FriendCard key={friend.id} friend={friend} onRemove={() => actions.removeFriend(friend.id)} />
              ))}
              {friends.length === 0 && (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">👥</span>
                  <p className="text-[var(--text-secondary)]">No friends yet</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Search for players to add friends</p>
                </div>
              )}
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === "requests" && (
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="game-card p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{request.from.avatar}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-[var(--text-primary)]">{request.from.name}</h3>
                      <p className="text-xs text-[var(--text-muted)]">Lv.{request.from.level} • Power: {request.from.power.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <GameButton variant="primary" size="sm" onClick={() => actions.acceptRequest(request.id)}>
                        ✓
                      </GameButton>
                      <GameButton variant="danger" size="sm" onClick={() => actions.rejectRequest(request.id)}>
                        ✕
                      </GameButton>
                    </div>
                  </div>
                </div>
              ))}
              {requests.length === 0 && (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">📬</span>
                  <p className="text-[var(--text-secondary)]">No pending requests</p>
                </div>
              )}
            </div>
          )}

          {/* Search Tab */}
          {activeTab === "search" && (
            <div>
              <div className="game-card p-4 mb-4">
                <input
                  type="text"
                  value={state.searchQuery}
                  onChange={(e) => actions.search(e.target.value)}
                  placeholder="Search by player name..."
                  className="w-full p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
                />
              </div>
              
              <div className="space-y-3">
                {state.searchResults.map((player) => (
                  <div key={player.id} className="game-card p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{player.avatar}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-[var(--text-primary)]">{player.name}</h3>
                        <p className="text-xs text-[var(--text-muted)]">Lv.{player.level} • Power: {player.power.toLocaleString()}</p>
                      </div>
                      <GameButton variant="primary" size="sm">
                        Add
                      </GameButton>
                    </div>
                  </div>
                ))}
                {state.searchQuery && state.searchResults.length === 0 && (
                  <p className="text-center text-[var(--text-muted)]">No players found</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Toast */}
        {state.error && (
          <div className="fixed bottom-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg z-50">
            {state.error}
            <button onClick={() => actions.setError(null)} className="ml-2">✕</button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function FriendCard({ friend, onRemove }: { friend: { id: string; name: string; level: number; power: number; status: string; lastSeen?: string; avatar: string }; onRemove: () => void }) {
  return (
    <div className="game-card p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <span className="text-3xl">{friend.avatar}</span>
          <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${statusColors[friend.status as keyof typeof statusColors]} border-2 border-[var(--bg-secondary)]`} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-[var(--text-primary)]">{friend.name}</h3>
          <p className="text-xs text-[var(--text-muted)]">
            Lv.{friend.level} • Power: {friend.power.toLocaleString()}
            {friend.status === "offline" && friend.lastSeen && ` • ${friend.lastSeen}`}
          </p>
        </div>
        <span className={`text-xs capitalize ${friend.status === "online" ? "text-green-400" : friend.status === "playing" ? "text-blue-400" : "text-gray-400"}`}>
          {friend.status}
        </span>
      </div>
    </div>
  );
}
