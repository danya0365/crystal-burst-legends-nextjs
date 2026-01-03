"use client";

import { GameButton } from "@/src/presentation/components/common/GameButton";
import { ThemeToggle } from "@/src/presentation/components/common/ThemeToggle";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { LandingViewModel } from "@/src/presentation/presenters/landing/LandingPresenter";
import { useLandingPresenter } from "@/src/presentation/presenters/landing/useLandingPresenter";
import Link from "next/link";

interface LandingViewProps {
  initialViewModel?: LandingViewModel;
}

export function LandingView({ initialViewModel }: LandingViewProps) {
  const { viewModel, loading, error } = useLandingPresenter(initialViewModel);

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
      <CrystalBubbleAnimation count={20} />
      
      {/* Navigation - Sticky */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur-lg">
        <h1 className="text-lg md:text-xl font-bold text-gradient-primary">Crystal Burst Legends</h1>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/terms" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Terms</Link>
            <Link href="/privacy" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Privacy</Link>
            <Link href="/contact" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Contact</Link>
          </div>
          <ThemeToggle />
          <Link href="/profiles">
            <GameButton variant="primary" size="sm">Play Now</GameButton>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 text-center py-20">
        <div className="mb-8 animate-bounce">
          <span className="text-7xl md:text-9xl">🔮</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gradient-primary mb-4">
          {content.heroTitle}
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-gold mb-6">
          {content.heroSubtitle}
        </h2>
        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-xl mb-8 px-4">
          {content.heroDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/profiles">
            <GameButton variant="primary" size="lg" icon="🎮">
              Start Playing
            </GameButton>
          </Link>
          <a href="#features">
            <GameButton variant="ghost" size="lg" icon="📖">
              Learn More
            </GameButton>
          </a>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <span className="text-3xl text-[var(--text-muted)]">↓</span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-4 md:px-6 bg-[var(--bg-secondary)]">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[var(--text-primary)] mb-4">
          ✨ Game Features
        </h2>
        <p className="text-center text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
          Experience the ultimate gacha RPG with stunning visuals and deep gameplay
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {content.features.map((f) => (
            <div key={f.id} className="game-card p-6 text-center hover:scale-105 transition-transform">
              <span className="text-4xl md:text-5xl mb-4 block">{f.icon}</span>
              <h3 className="text-lg md:text-xl font-bold text-[var(--text-primary)] mb-2">{f.title}</h3>
              <p className="text-sm md:text-base text-[var(--text-secondary)]">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Screenshots/Preview Section */}
      <section className="relative z-10 py-20 px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[var(--text-primary)] mb-4">
          🎮 Game Preview
        </h2>
        <p className="text-center text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
          Dive into a world of adventure and excitement
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {content.screenshots.map((s) => (
            <div key={s.id} className="game-card p-6 text-center">
              <div className="w-full aspect-video bg-[var(--bg-tertiary)] rounded-lg flex items-center justify-center mb-4">
                <span className="text-6xl">{s.icon}</span>
              </div>
              <h3 className="font-bold text-[var(--text-primary)]">{s.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 px-4 md:px-6 bg-[var(--bg-secondary)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
          {content.stats.map((s) => (
            <div key={s.id}>
              <p className="text-3xl md:text-4xl font-bold text-gradient-primary">{s.value}</p>
              <p className="text-sm text-[var(--text-secondary)]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 md:px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
          {content.ctaTitle}
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
          {content.ctaDescription}
        </p>
        <Link href="/profiles">
          <GameButton variant="primary" size="lg" icon="⚔️">
            Play Now - It's Free!
          </GameButton>
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border-color)] py-8 px-4 md:px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-gradient-primary">Crystal Burst Legends</h3>
              <p className="text-sm text-[var(--text-muted)]">© 2026 All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link href="/terms" className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)]">Terms</Link>
              <Link href="/privacy" className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)]">Privacy</Link>
              <Link href="/contact" className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)]">Contact</Link>
              <Link href="/profiles" className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary)]">Play Game</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
