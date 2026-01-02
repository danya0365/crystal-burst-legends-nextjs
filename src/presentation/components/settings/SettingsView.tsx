"use client";

import { SettingSection } from "@/src/application/repositories/ISettingsRepository";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { SettingsViewModel } from "@/src/presentation/presenters/settings/SettingsPresenter";
import { useSettingsPresenter } from "@/src/presentation/presenters/settings/useSettingsPresenter";
import { useTheme } from "next-themes";

interface SettingsViewProps {
  initialViewModel?: SettingsViewModel;
}

const sectionLabels: Record<SettingSection, { label: string; icon: string }> = {
  general: { label: "General", icon: "⚙️" },
  graphics: { label: "Graphics", icon: "🖼️" },
  audio: { label: "Audio", icon: "🔊" },
  account: { label: "Account", icon: "👤" },
};

export function SettingsView({ initialViewModel }: SettingsViewProps) {
  const [state, actions] = useSettingsPresenter(initialViewModel);
  const { theme, setTheme } = useTheme();
  const viewModel = state.viewModel;

  if (state.loading && !viewModel) {
    return (
      <MainLayout>
        <div className="relative w-full h-full flex items-center justify-center">
          <CrystalBubbleAnimation count={10} />
          <div className="text-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading settings...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const sectionItems = viewModel?.sectionItems || [];
  const sections = Object.keys(sectionLabels) as SettingSection[];

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={6} />

        {/* Header */}
        <div className="relative z-10 p-4 border-b border-[var(--border-color)]">
          <h1 className="text-2xl font-bold text-gradient-primary">Settings</h1>
        </div>

        {/* Section Tabs */}
        <div className="relative z-10 px-4 py-2 flex gap-2 overflow-x-auto border-b border-[var(--border-color)]">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => actions.setSection(section)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                state.selectedSection === section
                  ? "bg-[var(--color-primary)] text-black font-bold"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
              }`}
            >
              {sectionLabels[section].icon} {sectionLabels[section].label}
            </button>
          ))}
        </div>

        {/* Settings List */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-3">
          {/* Theme Toggle - Special (General section only) */}
          {state.selectedSection === "general" && (
            <div className="game-card p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">🌙 Dark Mode</h3>
                <p className="text-xs text-[var(--text-secondary)]">Toggle dark/light theme</p>
              </div>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  theme === "dark" ? "bg-[var(--color-primary)]" : "bg-gray-400"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    theme === "dark" ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          )}

          {sectionItems.map((item) => (
            <div key={item.id} className="game-card p-4 flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-bold text-[var(--text-primary)]">{item.label}</h3>
                <p className="text-xs text-[var(--text-secondary)]">{item.description}</p>
              </div>

              {item.type === "toggle" && (
                <button
                  onClick={() => actions.updateSetting(item.id, !item.value)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    item.value ? "bg-[var(--color-primary)]" : "bg-gray-400"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      item.value ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
              )}

              {item.type === "select" && (
                <select
                  value={item.value as string}
                  onChange={(e) => actions.updateSetting(item.id, e.target.value)}
                  className="px-3 py-1 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded text-sm text-[var(--text-primary)]"
                >
                  {item.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {item.type === "slider" && (
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={item.min || 0}
                    max={item.max || 100}
                    value={item.value as number}
                    onChange={(e) => actions.updateSetting(item.id, parseInt(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm text-[var(--text-primary)] w-8">{item.value}%</span>
                </div>
              )}

              {item.type === "action" && (
                <GameButton variant="ghost" size="sm">
                  Open
                </GameButton>
              )}
            </div>
          ))}

          {/* Reset Button */}
          <div className="pt-4">
            <GameButton
              variant="danger"
              fullWidth
              onClick={actions.resetToDefaults}
              disabled={state.loading}
            >
              Reset to Defaults
            </GameButton>
          </div>
        </div>

        {/* Version Info */}
        <div className="relative z-10 p-4 border-t border-[var(--border-color)] text-center">
          <p className="text-xs text-[var(--text-muted)]">Crystal Burst Legends v1.0.0</p>
          <p className="text-xs text-[var(--text-muted)]">© 2026 Crystal Studios</p>
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
