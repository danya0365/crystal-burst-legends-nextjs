"use client";

import { ShopCategory, ShopItem } from "@/src/application/repositories/IShopRepository";
import { GameButton } from "@/src/presentation/components/common/GameButton";
import { CrystalBubbleAnimation } from "@/src/presentation/components/effects/CrystalBubbleAnimation";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { ShopViewModel } from "@/src/presentation/presenters/shop/ShopPresenter";
import { useShopPresenter } from "@/src/presentation/presenters/shop/useShopPresenter";

interface ShopViewProps {
  initialViewModel?: ShopViewModel;
}

const categoryLabels: Record<ShopCategory, { label: string; icon: string }> = {
  crystals: { label: "Crystals", icon: "💎" },
  coins: { label: "Coins", icon: "🪙" },
  characters: { label: "Characters", icon: "👥" },
  items: { label: "Items", icon: "📦" },
  bundles: { label: "Bundles", icon: "🎁" },
  limited: { label: "Limited", icon: "⏰" },
};

export function ShopView({ initialViewModel }: ShopViewProps) {
  const [state, actions] = useShopPresenter(initialViewModel);
  const viewModel = state.viewModel;

  if (state.loading && !viewModel) {
    return (
      <MainLayout>
        <div className="relative w-full h-full flex items-center justify-center">
          <CrystalBubbleAnimation count={10} />
          <div className="text-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading Shop...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const categories = Object.keys(categoryLabels) as ShopCategory[];
  const displayItems = viewModel?.items || [];

  return (
    <MainLayout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        <CrystalBubbleAnimation count={8} />

        {/* Header */}
        <div className="relative z-10 p-4 border-b border-[var(--border-color)]">
          <h1 className="text-2xl font-bold text-gradient-primary">Shop</h1>
          
          {/* Limited Offers Banner */}
          {viewModel?.limitedOffers && viewModel.limitedOffers.length > 0 && (
            <div className="mt-2 p-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg border border-orange-500/50">
              <span className="text-orange-400 font-bold">🔥 {viewModel.limitedOffers.length} Limited Offers Available!</span>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="relative z-10 px-4 py-2 flex gap-2 overflow-x-auto border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => actions.setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                state.selectedCategory === cat
                  ? "bg-[var(--color-primary)] text-black font-bold"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {categoryLabels[cat].icon} {categoryLabels[cat].label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayItems.map((item) => (
              <ShopItemCard key={item.id} item={item} onPurchase={() => actions.purchase(item.id)} loading={state.loading} />
            ))}
          </div>

          {displayItems.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64">
              <span className="text-6xl mb-4">🛒</span>
              <p className="text-[var(--text-secondary)]">No items in this category</p>
            </div>
          )}
        </div>

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

interface ShopItemCardProps {
  item: ShopItem;
  onPurchase: () => void;
  loading: boolean;
}

function ShopItemCard({ item, onPurchase, loading }: ShopItemCardProps) {
  const currencyIcon = item.currency === "real" ? "$" : item.currency === "crystal" ? "💎" : "🪙";
  const isSoldOut = item.maxPurchase !== undefined && item.purchaseCount >= item.maxPurchase;

  return (
    <div className={`game-card p-4 ${isSoldOut ? "opacity-50" : ""}`}>
      {/* Discount Badge */}
      {item.discount && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
          -{item.discount}%
        </div>
      )}

      {/* Limited Badge */}
      {item.isLimited && (
        <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-bold">
          LIMITED
        </div>
      )}

      {/* Item Icon */}
      <div className="text-center mb-3">
        <span className="text-5xl">
          {item.category === "crystals" ? "💎" : item.category === "coins" ? "🪙" : item.category === "characters" ? "👤" : "📦"}
        </span>
      </div>

      {/* Name & Description */}
      <h3 className="font-bold text-[var(--text-primary)] text-center">{item.name}</h3>
      <p className="text-xs text-[var(--text-secondary)] text-center mt-1 line-clamp-2">{item.description}</p>

      {/* Quantity/Rewards Preview */}
      <div className="mt-2 text-center">
        <span className="text-[var(--color-secondary)] font-bold">
          x{item.quantity.toLocaleString()}
        </span>
      </div>

      {/* Price */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {item.originalPrice && (
          <span className="text-[var(--text-muted)] line-through text-sm">
            {currencyIcon}{item.originalPrice}
          </span>
        )}
        <span className="text-lg font-bold text-[var(--text-primary)]">
          {currencyIcon}{item.price}
        </span>
      </div>

      {/* Purchase Button */}
      <GameButton
        variant="primary"
        fullWidth
        className="mt-3"
        onClick={onPurchase}
        disabled={loading || isSoldOut}
      >
        {isSoldOut ? "Sold Out" : "Purchase"}
      </GameButton>

      {/* Purchase Limit */}
      {item.maxPurchase && (
        <p className="text-xs text-center text-[var(--text-muted)] mt-1">
          {item.purchaseCount}/{item.maxPurchase} purchased
        </p>
      )}
    </div>
  );
}
