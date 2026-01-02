/**
 * IShopRepository
 * Repository interface for Shop data access
 */

export type ShopCategory = "crystals" | "coins" | "characters" | "items" | "bundles" | "limited";
export type Currency = "real" | "crystal" | "coin";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ShopCategory;
  currency: Currency;
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
  maxPurchase?: number;
  purchaseCount: number;
  imageUrl?: string;
  isLimited: boolean;
  expiresAt?: string;
  rewards: ShopReward[];
}

export interface ShopReward {
  type: "crystal" | "coin" | "character" | "fragment" | "item";
  id?: string;
  name: string;
  amount: number;
}

export interface ShopBundle {
  id: string;
  name: string;
  description: string;
  currency: Currency;
  price: number;
  originalPrice: number;
  discount: number;
  items: ShopItem[];
  imageUrl?: string;
  isLimited: boolean;
  expiresAt?: string;
}

export interface ShopStats {
  totalItems: number;
  limitedOffers: number;
  dailyDealsRefreshIn: number;
}

export interface IShopRepository {
  getAll(): Promise<ShopItem[]>;
  getByCategory(category: ShopCategory): Promise<ShopItem[]>;
  getBundles(): Promise<ShopBundle[]>;
  getLimitedOffers(): Promise<ShopItem[]>;
  purchase(itemId: string, quantity?: number): Promise<ShopItem>;
  getStats(): Promise<ShopStats>;
}
