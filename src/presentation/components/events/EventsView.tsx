"use client";

import { EventType, GameEvent } from "@/src/application/repositories/IEventRepository";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { EventsViewModel } from "@/src/presentation/presenters/events/EventsPresenter";
import { useEventsPresenter } from "@/src/presentation/presenters/events/useEventsPresenter";

interface EventsViewProps {
  initialViewModel?: EventsViewModel;
}

const statusColors = {
  active: "border-green-400 bg-green-400/10",
  upcoming: "border-yellow-400 bg-yellow-400/10",
  ended: "border-gray-400 bg-gray-400/10",
};

const typeLabels: Record<EventType, string> = {
  limited: "Limited",
  login: "Login",
  challenge: "Challenge",
  celebration: "Celebration",
};

export function EventsView({ initialViewModel }: EventsViewProps) {
  const [state, actions] = useEventsPresenter(initialViewModel);
  const viewModel = state.viewModel;

  if (state.loading && !viewModel) {
    return (
      <MainLayout>
        <div className="relative w-full h-full flex items-center justify-center">
          <CrystalBubbleAnimation count={10} />
          <div className="text-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading events...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const events = viewModel?.events || [];
  const activeEvents = events.filter((e) => e.status === "active");
  const upcomingEvents = events.filter((e) => e.status === "upcoming");

  const formatTimeLeft = (endDate: string) => {
    const diff = new Date(endDate).getTime() - Date.now();
    if (diff <= 0) return "Ended";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={6} />

        {/* Header */}
        <div className="relative z-10 p-4 border-b border-[var(--border-color)]">
          <h1 className="text-2xl font-bold text-gradient-primary">Events</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {viewModel?.activeCount} active events
          </p>
        </div>

        {/* Events List */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4">
          {/* Active Events */}
          {activeEvents.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-green-400 mb-3">🎯 Active Events</h2>
              <div className="space-y-3">
                {activeEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    formatTimeLeft={formatTimeLeft}
                    onSelect={() => actions.selectEvent(event)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-yellow-400 mb-3">📅 Coming Soon</h2>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    formatTimeLeft={formatTimeLeft}
                    onSelect={() => actions.selectEvent(event)}
                  />
                ))}
              </div>
            </div>
          )}

          {events.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64">
              <span className="text-6xl mb-4">🎉</span>
              <p className="text-[var(--text-secondary)]">No events available</p>
            </div>
          )}
        </div>

        {/* Event Detail Modal */}
        {state.selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="game-card w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{state.selectedEvent.banner}</span>
                    <div>
                      <h3 className="font-bold text-lg text-[var(--text-primary)]">{state.selectedEvent.title}</h3>
                      <span className={`text-xs ${state.selectedEvent.status === "active" ? "text-green-400" : "text-yellow-400"}`}>
                        {typeLabels[state.selectedEvent.type]} • {state.selectedEvent.status === "active" ? formatTimeLeft(state.selectedEvent.endDate) : "Coming Soon"}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => actions.selectEvent(null)} className="text-2xl">✕</button>
                </div>

                <p className="text-sm text-[var(--text-secondary)] mb-4">{state.selectedEvent.description}</p>

                {/* Progress */}
                {state.selectedEvent.progress && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--text-muted)]">Progress</span>
                      <span className="text-[var(--text-secondary)]">
                        {state.selectedEvent.progress.current}/{state.selectedEvent.progress.target}
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)]"
                        style={{ width: `${(state.selectedEvent.progress.current / state.selectedEvent.progress.target) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Rewards */}
                <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-2">Rewards</h4>
                <div className="space-y-2">
                  {state.selectedEvent.rewards.map((reward, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-3 rounded-lg ${reward.claimed ? "bg-green-500/10 opacity-50" : "bg-[var(--bg-tertiary)]"}`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{reward.type === "crystal" ? "💎" : reward.type === "coin" ? "🪙" : reward.type === "character" ? "👤" : "📦"}</span>
                        <span className="text-sm text-[var(--text-primary)]">
                          {reward.amount > 1 ? `${reward.amount} ` : ""}{reward.name}
                        </span>
                      </div>
                      {reward.claimed ? (
                        <span className="text-green-400 text-sm">✓</span>
                      ) : state.selectedEvent?.status === "active" ? (
                        <GameButton
                          variant="primary"
                          size="sm"
                          onClick={() => actions.claimReward(state.selectedEvent!.id, index)}
                        >
                          Claim
                        </GameButton>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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

function EventCard({ event, formatTimeLeft, onSelect }: { event: GameEvent; formatTimeLeft: (d: string) => string; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={`game-card p-4 cursor-pointer hover:scale-[1.02] transition-all border-l-4 ${statusColors[event.status]}`}
    >
      <div className="flex gap-3">
        <span className="text-3xl">{event.banner}</span>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-[var(--text-primary)]">{event.title}</h3>
            <span className={`text-xs ${event.status === "active" ? "text-green-400" : "text-yellow-400"}`}>
              {event.status === "active" ? formatTimeLeft(event.endDate) : "Soon"}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{event.description}</p>
          {event.progress && (
            <div className="mt-2 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)]"
                style={{ width: `${(event.progress.current / event.progress.target) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
