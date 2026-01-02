"use client";

import { FAQCategory } from "@/src/application/repositories/ISupportRepository";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { SupportViewModel } from "@/src/presentation/presenters/support/SupportPresenter";
import { useSupportPresenter } from "@/src/presentation/presenters/support/useSupportPresenter";
import { useState } from "react";

interface SupportViewProps {
  initialViewModel?: SupportViewModel;
}

const categoryLabels: Record<FAQCategory, { label: string; icon: string }> = {
  account: { label: "Account", icon: "👤" },
  gameplay: { label: "Gameplay", icon: "🎮" },
  payment: { label: "Payment", icon: "💳" },
  technical: { label: "Technical", icon: "🔧" },
};

export function SupportView({ initialViewModel }: SupportViewProps) {
  const [state, actions] = useSupportPresenter(initialViewModel);
  const [activeTab, setActiveTab] = useState<"faq" | "tickets" | "contact">("faq");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const viewModel = state.viewModel;

  if (state.loading && !viewModel) {
    return (
      <MainLayout>
        <div className="relative w-full h-full flex items-center justify-center">
          <CrystalBubbleAnimation count={10} />
          <div className="text-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading support...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) return;
    await actions.createTicket(subject, message);
    setSubject("");
    setMessage("");
  };

  const faqs = viewModel?.faqs || [];
  const tickets = viewModel?.tickets || [];

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={6} />

        {/* Header */}
        <div className="relative z-10 p-4 border-b border-[var(--border-color)]">
          <h1 className="text-2xl font-bold text-gradient-primary">Support</h1>
        </div>

        {/* Tabs */}
        <div className="relative z-10 px-4 py-2 flex gap-2 border-b border-[var(--border-color)]">
          {(["faq", "tickets", "contact"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                activeTab === tab
                  ? "bg-[var(--color-primary)] text-black font-bold"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
              }`}
            >
              {tab === "faq" ? "❓ FAQ" : tab === "tickets" ? "📋 My Tickets" : "📝 Contact"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4">
          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div className="space-y-3">
              {Object.keys(categoryLabels).map((cat) => {
                const category = cat as FAQCategory;
                const categoryFaqs = faqs.filter((f) => f.category === category);
                if (categoryFaqs.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-2">
                      {categoryLabels[category].icon} {categoryLabels[category].label}
                    </h3>
                    {categoryFaqs.map((faq) => (
                      <div key={faq.id} className="game-card mb-2">
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                          className="w-full p-4 text-left flex justify-between items-center"
                        >
                          <span className="text-sm text-[var(--text-primary)]">{faq.question}</span>
                          <span className="text-[var(--text-muted)]">{expandedFAQ === faq.id ? "▲" : "▼"}</span>
                        </button>
                        {expandedFAQ === faq.id && (
                          <div className="px-4 pb-4 text-sm text-[var(--text-secondary)]">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tickets Tab */}
          {activeTab === "tickets" && (
            <div className="space-y-3">
              {tickets.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">📋</span>
                  <p className="text-[var(--text-secondary)]">No tickets yet</p>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <div key={ticket.id} className="game-card p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-[var(--text-primary)]">{ticket.subject}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        ticket.status === "resolved" ? "bg-green-500/20 text-green-400" :
                        ticket.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-blue-500/20 text-blue-400"
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="space-y-4">
              <div className="game-card p-4">
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's your issue?"
                  className="w-full p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
                />
              </div>
              <div className="game-card p-4">
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  rows={5}
                  className="w-full p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] resize-none"
                />
              </div>
              <GameButton
                variant="primary"
                fullWidth
                onClick={handleSubmit}
                disabled={!subject.trim() || !message.trim() || state.loading}
              >
                {state.loading ? "Submitting..." : "Submit Ticket"}
              </GameButton>
            </div>
          )}
        </div>

        {/* Success/Error Toast */}
        {state.success && (
          <div className="fixed bottom-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50">
            {state.success}
            <button onClick={() => actions.setSuccess(null)} className="ml-2">✕</button>
          </div>
        )}
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
