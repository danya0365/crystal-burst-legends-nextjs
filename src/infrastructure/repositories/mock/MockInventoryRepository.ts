/**
 * MockInventoryRepository
 * Mock implementation for Inventory data
 */

import {
    IInventoryRepository,
    InventoryItem,
    InventoryStats,
    ItemCategory,
} from "@/src/application/repositories/IInventoryRepository";

const MOCK_ITEMS: InventoryItem[] = [
  // Weapons
  { id: "w1", name: "Crystal Sword", description: "A blade infused with crystal energy", category: "weapon", rarity: "rare", quantity: 1, icon: "⚔️", sellPrice: 500, stats: { attack: 120, critRate: 5 } },
  { id: "w2", name: "Fire Staff", description: "Staff that channels fire magic", category: "weapon", rarity: "epic", quantity: 1, icon: "🔥", sellPrice: 1200, stats: { attack: 150, magicPower: 80 } },
  { id: "w3", name: "Iron Dagger", description: "A simple iron dagger", category: "weapon", rarity: "common", quantity: 2, icon: "🗡️", sellPrice: 50, stats: { attack: 30 } },
  
  // Armor
  { id: "a1", name: "Dragon Scale Armor", description: "Armor made from dragon scales", category: "armor", rarity: "legendary", quantity: 1, icon: "🛡️", sellPrice: 3000, stats: { defense: 200, hp: 500 } },
  { id: "a2", name: "Leather Vest", description: "Basic leather protection", category: "armor", rarity: "common", quantity: 3, icon: "🦺", sellPrice: 30, stats: { defense: 20 } },
  { id: "a3", name: "Mage Robe", description: "Enchanted robe for mages", category: "armor", rarity: "rare", quantity: 1, icon: "👘", sellPrice: 400, stats: { defense: 50, magicPower: 40 } },
  
  // Accessories
  { id: "ac1", name: "Crystal Ring", description: "Ring with a crystal gem", category: "accessory", rarity: "epic", quantity: 1, icon: "💍", sellPrice: 800, stats: { critRate: 10, critDamage: 20 } },
  { id: "ac2", name: "Speed Boots", description: "Boots that increase speed", category: "accessory", rarity: "rare", quantity: 1, icon: "👢", sellPrice: 350, stats: { speed: 30 } },
  
  // Materials
  { id: "m1", name: "Crystal Shard", description: "A fragment of pure crystal", category: "material", rarity: "uncommon", quantity: 50, icon: "💎", sellPrice: 10 },
  { id: "m2", name: "Dragon Scale", description: "Scale from a dragon", category: "material", rarity: "epic", quantity: 5, icon: "🐉", sellPrice: 200 },
  { id: "m3", name: "Iron Ore", description: "Raw iron ore", category: "material", rarity: "common", quantity: 100, icon: "�ite", sellPrice: 5 },
  { id: "m4", name: "Magic Essence", description: "Concentrated magic energy", category: "material", rarity: "rare", quantity: 20, icon: "✨", sellPrice: 50 },
  
  // Consumables
  { id: "c1", name: "Health Potion", description: "Restores 500 HP", category: "consumable", rarity: "common", quantity: 15, icon: "🧪", sellPrice: 20 },
  { id: "c2", name: "Energy Drink", description: "Restores 20 Energy", category: "consumable", rarity: "uncommon", quantity: 8, icon: "⚡", sellPrice: 50 },
  { id: "c3", name: "EXP Boost", description: "Double EXP for 1 hour", category: "consumable", rarity: "rare", quantity: 3, icon: "📈", sellPrice: 100 },
];

export class MockInventoryRepository implements IInventoryRepository {
  private items = [...MOCK_ITEMS];

  async getAll(): Promise<InventoryItem[]> {
    await this.delay(100);
    return [...this.items];
  }

  async getByCategory(category: ItemCategory): Promise<InventoryItem[]> {
    await this.delay(100);
    return this.items.filter((i) => i.category === category);
  }

  async getItem(id: string): Promise<InventoryItem | null> {
    await this.delay(50);
    return this.items.find((i) => i.id === id) || null;
  }

  async useItem(id: string): Promise<InventoryItem> {
    await this.delay(150);
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error("Item not found");
    if (this.items[index].category !== "consumable") throw new Error("Item cannot be used");
    if (this.items[index].quantity <= 0) throw new Error("No items left");
    
    this.items[index] = { ...this.items[index], quantity: this.items[index].quantity - 1 };
    return this.items[index];
  }

  async sellItem(id: string, quantity: number): Promise<{ item: InventoryItem; coins: number }> {
    await this.delay(150);
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error("Item not found");
    if (this.items[index].quantity < quantity) throw new Error("Not enough items");
    
    const coins = this.items[index].sellPrice * quantity;
    this.items[index] = { ...this.items[index], quantity: this.items[index].quantity - quantity };
    return { item: this.items[index], coins };
  }

  async getStats(): Promise<InventoryStats> {
    await this.delay(50);
    const categories: Record<ItemCategory, number> = { weapon: 0, armor: 0, accessory: 0, material: 0, consumable: 0 };
    let totalItems = 0;
    
    for (const item of this.items) {
      categories[item.category] += item.quantity;
      totalItems += item.quantity;
    }
    
    return { totalItems, maxCapacity: 500, categories };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
