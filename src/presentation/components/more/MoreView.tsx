"use client";

/**
 * MoreView
 * More menu page with staggered card animations and profile actions
 */

import { useProfileStore } from "@/src/infrastructure/stores/useProfileStore";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import type { MoreViewModel } from "@/src/presentation/presenters/more/MorePresenter";
import { useMorePresenter } from "@/src/presentation/presenters/more/useMorePresenter";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { animated } from "react-spring";

interface MoreViewProps {
  initialViewModel?: MoreViewModel;
}

export function MoreView({ initialViewModel }: MoreViewProps) {
  const router = useRouter();
  const { logout, getActiveProfile } = useProfileStore();
  const activeProfile = getActiveProfile();

  const { viewModel, isLoading, headerSpring, cardSprings } =
    useMorePresenter(initialViewModel);

  const handleReturnToTitle = () => {
    logout();
    router.push("/");
  };

  const handleSwitchProfile = () => {
    router.push("/profiles");
  };

  if (isLoading || !viewModel) {
    return (
      <MainLayout>
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl animate-pulse mb-4">⚙️</div>
            <p className="text-[var(--text-secondary)]">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={8} />

        {/* Header */}
        <animated.div
          style={headerSpring}
          className="relative z-10 p-4 border-b border-[var(--border-color)]"
        >
          <h1 className="text-2xl font-bold text-gradient-primary">More</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Additional features and settings
          </p>
        </animated.div>

        {/* Menu Grid */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4">
          {/* Current Profile */}
          {activeProfile && (
            <animated.div
              style={headerSpring}
              className="game-card p-4 mb-4 flex items-center gap-3"
            >
              <span className="text-3xl">{activeProfile.avatar}</span>
              <div className="flex-1">
                <p className="font-bold text-[var(--text-primary)]">
                  {activeProfile.name}
                </p>
                <p className="text-xs text-[var(--text-muted)]">Playing as</p>
              </div>
            </animated.div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {viewModel.menuItems.map((item, index) => (
              <animated.div key={item.id} style={cardSprings[index]}>
                <Link href={item.href}>
                  <div className="game-card p-4 h-full hover:scale-105 transition-transform cursor-pointer">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <h3 className="font-bold text-[var(--text-primary)]">
                      {item.label}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </animated.div>
            ))}
          </div>

          {/* Account Actions */}
          <div className="mt-6 space-y-3">
            <GameButton
              variant="secondary"
              fullWidth
              onClick={handleSwitchProfile}
              icon="🔄"
            >
              Switch Profile
            </GameButton>
            <GameButton
              variant="ghost"
              fullWidth
              onClick={handleReturnToTitle}
              icon="🏠"
            >
              Return to Title
            </GameButton>
          </div>

          {/* Game Info */}
          <div className="mt-6 game-card p-4 text-center">
            <p className="text-[var(--text-muted)] text-sm">
              {viewModel.gameInfo.name}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Version {viewModel.gameInfo.version}
            </p>
            <div className="flex justify-center gap-4 mt-3">
              <Link href="/terms" className="text-xs text-[var(--color-primary)]">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-xs text-[var(--color-primary)]">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
