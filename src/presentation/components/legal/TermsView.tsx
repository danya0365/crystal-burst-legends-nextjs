"use client";

import { GameButton } from "@/src/presentation/components/common/GameButton";
import { ThemeToggle } from "@/src/presentation/components/common/ThemeToggle";
import { TermsViewModel } from "@/src/presentation/presenters/legal/LegalPresenter";
import { useTermsPresenter } from "@/src/presentation/presenters/legal/useLegalPresenter";
import Link from "next/link";

interface TermsViewProps {
  initialViewModel?: TermsViewModel;
}

export function TermsView({ initialViewModel }: TermsViewProps) {
  const { viewModel, loading, error } = useTermsPresenter(initialViewModel);

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

  const { content } = viewModel;

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur-lg">
        <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          ← Back
        </Link>
        <h1 className="text-lg font-bold text-gradient-primary">{content.title}</h1>
        <ThemeToggle />
      </header>

      <div className="max-w-3xl mx-auto p-4 md:p-6 pb-12">
        <div className="game-card p-6 space-y-6 text-[var(--text-secondary)]">
          {content.sections.map((section) => (
            <section key={section.id}>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">{section.title}</h2>
              <p>{section.content}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/profiles">
            <GameButton variant="primary">Start Playing</GameButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
