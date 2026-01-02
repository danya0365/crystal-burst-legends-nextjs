/**
 * IInventoryRepository
 * Repository interface for Inventory data access
 */

export type ItemCategory = "weapon" | "armor" | "accessory" | "material" | "consumable";
export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  rarity: ItemRarity;
  quantity: number;
  icon: string;
  sellPrice: number;
  stats?: Record<string, number>;
  equippedBy?: string;
}

export interface InventoryStats {
  totalItems: number;
  maxCapacity: number;
  categories: Record<ItemCategory, number>;
}

export interface IInventoryRepository {
  getAll(): Promise<InventoryItem[]>;
  getByCategory(category: ItemCategory): Promise<InventoryItem[]>;
  getItem(id: string): Promise<InventoryItem | null>;
  useItem(id: string): Promise<InventoryItem>;
  sellItem(id: string, quantity: number): Promise<{ item: InventoryItem; coins: number }>;
  getStats(): Promise<InventoryStats>;
}
