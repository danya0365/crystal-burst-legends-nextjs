import { InventoryView } from "@/src/presentation/components/inventory/InventoryView";
import { createServerInventoryPresenter } from "@/src/presentation/presenters/inventory/InventoryPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inventory | Crystal Burst Legends",
  description: "Manage your items and equipment",
};

export default async function InventoryPage() {
  const presenter = createServerInventoryPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <InventoryView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading inventory:", error);
    return <InventoryView />;
  }
}
