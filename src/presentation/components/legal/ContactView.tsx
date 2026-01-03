"use client";

import { GameButton } from "@/src/presentation/components/common/GameButton";
import { ThemeToggle } from "@/src/presentation/components/common/ThemeToggle";
import { ContactViewModel } from "@/src/presentation/presenters/legal/LegalPresenter";
import { useContactPresenter } from "@/src/presentation/presenters/legal/useLegalPresenter";
import Link from "next/link";
import { useState } from "react";

interface ContactViewProps {
  initialViewModel?: ContactViewModel;
}

export function ContactView({ initialViewModel }: ContactViewProps) {
  const { viewModel, loading, error } = useContactPresenter(initialViewModel);
  const [sent, setSent] = useState(false);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }

  if (error || !viewModel) {
    return (
      <div className="fixed inset-0 bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading content</p>
          <GameButton variant="primary" onClick={() => window.location.reload()}>
            Retry
          </GameButton>
        </div>
      </div>
    );
  }

  const { contactInfo } = viewModel;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur-lg">
        <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          ← Back
        </Link>
        <h1 className="text-lg font-bold text-gradient-primary">Contact Us</h1>
        <ThemeToggle />
      </header>

      <div className="max-w-2xl mx-auto p-4 md:p-6 pb-12">
        <div className="game-card p-6">
          {sent ? (
            <div className="text-center py-8">
              <span className="text-6xl mb-4 block">✅</span>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Message Sent!</h2>
              <p className="text-[var(--text-secondary)] mb-6">We'll get back to you soon.</p>
              <GameButton variant="primary" onClick={() => setSent(false)}>
                Send Another Message
              </GameButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2">Email</label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="w-full p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2">Subject</label>
                <select className="w-full p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                  <option>General Inquiry</option>
                  <option>Bug Report</option>
                  <option>Feature Request</option>
                  <option>Account Issue</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              
              <GameButton type="submit" variant="primary" fullWidth>
                Send Message
              </GameButton>
            </form>
          )}
        </div>

        <div className="mt-8 game-card p-6 text-center">
          <h3 className="font-bold text-[var(--text-primary)] mb-2">Other Ways to Reach Us</h3>
          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            <p>📧 Email: {contactInfo.email}</p>
            <p>💬 Discord: {contactInfo.discord}</p>
            <p>🐦 Twitter: {contactInfo.twitter}</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/profiles">
            <GameButton variant="ghost">Play Game Instead →</GameButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
