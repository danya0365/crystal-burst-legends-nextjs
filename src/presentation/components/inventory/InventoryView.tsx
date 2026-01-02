"use client";

import { ItemCategory, ItemRarity } from "@/src/application/repositories/IInventoryRepository";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { InventoryViewModel } from "@/src/presentation/presenters/inventory/InventoryPresenter";
import { useInventoryPresenter } from "@/src/presentation/presenters/inventory/useInventoryPresenter";

interface InventoryViewProps {
  initialViewModel?: InventoryViewModel;
}

const categoryLabels: Record<ItemCategory | "all", { label: string; icon: string }> = {
  all: { label: "All", icon: "📦" },
  weapon: { label: "Weapons", icon: "⚔️" },
  armor: { label: "Armor", icon: "🛡️" },
  accessory: { label: "Accessories", icon: "💍" },
  material: { label: "Materials", icon: "✨" },
  consumable: { label: "Consumables", icon: "🧪" },
};

const rarityColors: Record<ItemRarity, string> = {
  common: "border-gray-400 bg-gray-400/10",
  uncommon: "border-green-400 bg-green-400/10",
  rare: "border-cyan-400 bg-cyan-400/10",
  epic: "border-purple-400 bg-purple-400/10",
  legendary: "border-yellow-400 bg-yellow-400/10",
};

export function InventoryView({ initialViewModel }: InventoryViewProps) {
  const [state, actions] = useInventoryPresenter(initialViewModel);
  const viewModel = state.viewModel;

  if (state.loading && !viewModel) {
    return (
      <MainLayout>
        <div className="relative w-full h-full flex items-center justify-center">
          <CrystalBubbleAnimation count={10} />
          <div className="text-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading inventory...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const items = viewModel?.items || [];
  const stats = viewModel?.stats;
  const categories: (ItemCategory | "all")[] = ["all", "weapon", "armor", "accessory", "material", "consumable"];

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={6} />

        {/* Header */}
        <div className="relative z-10 p-4 border-b border-[var(--border-color)]">
          <h1 className="text-2xl font-bold text-gradient-primary">Inventory</h1>
          {stats && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {stats.totalItems}/{stats.maxCapacity} items
            </p>
          )}
        </div>

        {/* Category Tabs */}
        <div className="relative z-10 px-4 py-2 flex gap-2 overflow-x-auto border-b border-[var(--border-color)]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => actions.setCategory(cat)}
              className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                state.selectedCategory === cat
                  ? "bg-[var(--color-primary)] text-black font-bold"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
              }`}
            >
              {categoryLabels[cat].icon} {categoryLabels[cat].label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => actions.selectItem(item)}
                className={`aspect-square rounded-xl border-2 ${rarityColors[item.rarity]} flex flex-col items-center justify-center p-2 cursor-pointer hover:scale-105 transition-all`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] text-center truncate w-full mt-1">{item.name}</span>
                <span className="text-xs text-[var(--text-muted)]">x{item.quantity}</span>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64">
              <span className="text-6xl mb-4">📦</span>
              <p className="text-[var(--text-secondary)]">No items found</p>
            </div>
          )}
        </div>

        {/* Item Detail Modal */}
        {state.selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="game-card w-full max-w-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{state.selectedItem.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--text-primary)]">{state.selectedItem.name}</h3>
                    <span className={`text-xs capitalize ${state.selectedItem.rarity === "legendary" ? "text-yellow-400" : state.selectedItem.rarity === "epic" ? "text-purple-400" : "text-[var(--text-muted)]"}`}>
                      {state.selectedItem.rarity}
                    </span>
                  </div>
                </div>
                <button onClick={() => actions.selectItem(null)} className="text-2xl">✕</button>
              </div>

              <p className="text-sm text-[var(--text-secondary)] mb-4">{state.selectedItem.description}</p>
              
              {state.selectedItem.stats && (
                <div className="bg-[var(--bg-tertiary)] rounded-lg p-3 mb-4">
                  <h4 className="text-xs text-[var(--text-muted)] mb-2">Stats</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(state.selectedItem.stats).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-[var(--text-secondary)] capitalize">{key}</span>
                        <span className="text-green-400">+{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-[var(--text-secondary)]">Quantity: <span className="text-[var(--text-primary)]">{state.selectedItem.quantity}</span></span>
                <span className="text-sm text-yellow-400">🪙 {state.selectedItem.sellPrice}/ea</span>
              </div>

              <div className="flex gap-2">
                {state.selectedItem.category === "consumable" && (
                  <GameButton variant="primary" fullWidth onClick={() => actions.useItem(state.selectedItem!.id)}>
                    Use
                  </GameButton>
                )}
                <GameButton variant="secondary" fullWidth onClick={() => actions.sellItem(state.selectedItem!.id, 1)}>
                  Sell (1)
                </GameButton>
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
