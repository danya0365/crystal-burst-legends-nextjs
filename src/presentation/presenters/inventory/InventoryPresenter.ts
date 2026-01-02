import { IInventoryRepository, InventoryItem, InventoryStats, ItemCategory } from "@/src/application/repositories/IInventoryRepository";
import { Metadata } from "next";

export interface InventoryViewModel {
  items: InventoryItem[];
  stats: InventoryStats;
  selectedCategory: ItemCategory | "all";
}

export class InventoryPresenter {
  constructor(private readonly repository: IInventoryRepository) {}

  async getViewModel(category: ItemCategory | "all" = "all"): Promise<InventoryViewModel> {
    const [items, stats] = await Promise.all([
      category === "all" ? this.repository.getAll() : this.repository.getByCategory(category),
      this.repository.getStats(),
    ]);
    return { items, stats, selectedCategory: category };
  }

  generateMetadata(): Metadata {
    return {
      title: "Inventory | Crystal Burst Legends",
      description: "Manage your items and equipment",
    };
  }

  async useItem(id: string): Promise<InventoryItem> {
    return this.repository.useItem(id);
  }

  async sellItem(id: string, quantity: number): Promise<{ item: InventoryItem; coins: number }> {
    return this.repository.sellItem(id, quantity);
  }
}
