import { IShopRepository, ShopBundle, ShopCategory, ShopItem, ShopStats } from "@/src/application/repositories/IShopRepository";
import { Metadata } from "next";

export interface ShopViewModel {
  items: ShopItem[];
  bundles: ShopBundle[];
  limitedOffers: ShopItem[];
  stats: ShopStats;
  selectedCategory: ShopCategory;
}

export class ShopPresenter {
  constructor(private readonly repository: IShopRepository) {}

  async getViewModel(category?: ShopCategory): Promise<ShopViewModel> {
    const [items, bundles, limitedOffers, stats] = await Promise.all([
      category ? this.repository.getByCategory(category) : this.repository.getAll(),
      this.repository.getBundles(),
      this.repository.getLimitedOffers(),
      this.repository.getStats(),
    ]);
    return { items, bundles, limitedOffers, stats, selectedCategory: category || "crystals" };
  }

  generateMetadata(): Metadata {
    return { title: "Shop | Crystal Burst Legends", description: "Purchase crystals, items, and more in Crystal Burst Legends" };
  }

  async purchase(itemId: string): Promise<ShopItem> {
    return this.repository.purchase(itemId);
  }
}
