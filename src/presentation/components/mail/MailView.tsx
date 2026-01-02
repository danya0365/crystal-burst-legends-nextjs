"use client";

import { MailType } from "@/src/application/repositories/IMailRepository";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { MailViewModel } from "@/src/presentation/presenters/mail/MailPresenter";
import { useMailPresenter } from "@/src/presentation/presenters/mail/useMailPresenter";

interface MailViewProps {
  initialViewModel?: MailViewModel;
}

const typeIcons: Record<MailType, string> = {
  system: "📢",
  reward: "🎁",
  event: "🎉",
  social: "👤",
};

export function MailView({ initialViewModel }: MailViewProps) {
  const [state, actions] = useMailPresenter(initialViewModel);
  const viewModel = state.viewModel;

  if (state.loading && !viewModel) {
    return (
      <MainLayout>
        <div className="relative w-full h-full flex items-center justify-center">
          <CrystalBubbleAnimation count={10} />
          <div className="text-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading mail...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const mails = viewModel?.mails || [];
  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return "Yesterday";
    return d.toLocaleDateString();
  };

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={6} />

        {/* Header */}
        <div className="relative z-10 p-4 border-b border-[var(--border-color)] flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gradient-primary">Mail</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {viewModel?.unreadCount || 0} unread • {viewModel?.unclaimedCount || 0} unclaimed
            </p>
          </div>
          {(viewModel?.unclaimedCount || 0) > 0 && (
            <GameButton variant="primary" onClick={() => actions.claimAll()}>
              Claim All
            </GameButton>
          )}
        </div>

        {/* Mail List */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-2">
          {mails.map((mail) => (
            <div
              key={mail.id}
              onClick={() => actions.selectMail(mail)}
              className={`game-card p-4 cursor-pointer hover:scale-[1.01] transition-all ${!mail.read ? "border-l-4 border-[var(--color-primary)]" : ""}`}
            >
              <div className="flex gap-3">
                <span className="text-2xl">{typeIcons[mail.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className={`font-bold truncate ${!mail.read ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                      {mail.title}
                    </h3>
                    <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">{formatTime(mail.sentAt)}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] truncate">{mail.sender}</p>
                  {mail.attachments.length > 0 && !mail.claimed && (
                    <div className="flex gap-1 mt-1">
                      {mail.attachments.map((att, i) => (
                        <span key={i} className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                          {att.icon} {att.amount}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {mails.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📭</span>
              <p className="text-[var(--text-secondary)]">No mail</p>
            </div>
          )}
        </div>

        {/* Mail Detail Modal */}
        {state.selectedMail && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="game-card w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{typeIcons[state.selectedMail.type]}</span>
                    <div>
                      <h3 className="font-bold text-lg text-[var(--text-primary)]">{state.selectedMail.title}</h3>
                      <p className="text-xs text-[var(--text-muted)]">From: {state.selectedMail.sender}</p>
                    </div>
                  </div>
                  <button onClick={() => actions.selectMail(null)} className="text-2xl">✕</button>
                </div>

                <p className="text-sm text-[var(--text-secondary)] mb-4">{state.selectedMail.content}</p>

                {state.selectedMail.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-2">Attachments</h4>
                    <div className="space-y-2">
                      {state.selectedMail.attachments.map((att, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-[var(--bg-tertiary)] rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{att.icon}</span>
                            <span className="text-[var(--text-primary)]">{att.name}</span>
                          </div>
                          <span className="text-yellow-400 font-bold">x{att.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {state.selectedMail.attachments.length > 0 && !state.selectedMail.claimed && (
                  <GameButton
                    variant="primary"
                    fullWidth
                    onClick={() => actions.claimAttachments(state.selectedMail!.id)}
                  >
                    Claim Rewards
                  </GameButton>
                )}

                {state.selectedMail.claimed && (
                  <p className="text-center text-green-400 text-sm">✓ Claimed</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rewards Popup */}
        {state.claimedRewards && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="game-card p-6 text-center">
              <h3 className="text-xl font-bold text-gradient-primary mb-4">🎉 Rewards Claimed!</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {state.claimedRewards.map((att, i) => (
                  <div key={i} className="bg-[var(--bg-tertiary)] p-3 rounded-lg">
                    <span className="text-2xl">{att.icon}</span>
                    <p className="text-sm text-[var(--text-primary)]">{att.name}</p>
                    <p className="text-lg font-bold text-yellow-400">+{att.amount}</p>
                  </div>
                ))}
              </div>
              <GameButton variant="primary" onClick={() => actions.clearRewards()}>
                OK
              </GameButton>
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
