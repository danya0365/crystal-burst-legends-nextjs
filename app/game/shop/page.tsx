import { ShopView } from "@/src/presentation/components/shop/ShopView";
import { createServerShopPresenter } from "@/src/presentation/presenters/shop/ShopPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop | Crystal Burst Legends",
  description: "Purchase crystals, items, and more in Crystal Burst Legends",
};

export default async function ShopPage() {
  const presenter = createServerShopPresenter();
  try {
    const viewModel = await presenter.getViewModel();
    return <ShopView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading shop:", error);
    return <ShopView />;
  }
}
