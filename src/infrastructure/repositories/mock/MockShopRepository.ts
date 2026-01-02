/**
 * MockShopRepository
 * Mock implementation for Shop data
 */

import {
    IShopRepository,
    ShopBundle,
    ShopCategory,
    ShopItem,
    ShopStats,
} from "@/src/application/repositories/IShopRepository";

const MOCK_SHOP_ITEMS: ShopItem[] = [
  // Crystals
  {
    id: "crystal-pack-1",
    name: "Crystal Pack (Small)",
    description: "100 Crystals for your adventures",
    category: "crystals",
    currency: "real",
    price: 0.99,
    quantity: 100,
    purchaseCount: 0,
    isLimited: false,
    rewards: [{ type: "crystal", name: "Crystals", amount: 100 }],
  },
  {
    id: "crystal-pack-2",
    name: "Crystal Pack (Medium)",
    description: "550 Crystals + 50 Bonus",
    category: "crystals",
    currency: "real",
    price: 4.99,
    originalPrice: 5.99,
    discount: 17,
    quantity: 600,
    purchaseCount: 0,
    isLimited: false,
    rewards: [{ type: "crystal", name: "Crystals", amount: 600 }],
  },
  {
    id: "crystal-pack-3",
    name: "Crystal Pack (Large)",
    description: "1200 Crystals + 200 Bonus",
    category: "crystals",
    currency: "real",
    price: 9.99,
    originalPrice: 14.99,
    discount: 33,
    quantity: 1400,
    purchaseCount: 0,
    isLimited: false,
    rewards: [{ type: "crystal", name: "Crystals", amount: 1400 }],
  },
  // Coins
  {
    id: "coin-pack-1",
    name: "Coin Pouch",
    description: "10,000 Coins",
    category: "coins",
    currency: "crystal",
    price: 50,
    quantity: 10000,
    purchaseCount: 0,
    isLimited: false,
    rewards: [{ type: "coin", name: "Coins", amount: 10000 }],
  },
  {
    id: "coin-pack-2",
    name: "Coin Chest",
    description: "50,000 Coins",
    category: "coins",
    currency: "crystal",
    price: 200,
    originalPrice: 250,
    discount: 20,
    quantity: 50000,
    purchaseCount: 0,
    isLimited: false,
    rewards: [{ type: "coin", name: "Coins", amount: 50000 }],
  },
  // Character Fragments
  {
    id: "char-frag-001",
    name: "Crystal Knight Fragments",
    description: "Fragments to unlock Crystal Knight",
    category: "characters",
    currency: "crystal",
    price: 100,
    quantity: 10,
    maxPurchase: 5,
    purchaseCount: 0,
    isLimited: true,
    rewards: [{ type: "fragment", id: "char-001", name: "Crystal Knight Fragment", amount: 10 }],
  },
  {
    id: "char-frag-007",
    name: "Phoenix Lord Fragments",
    description: "Rare fragments of the mythic Phoenix Lord",
    category: "characters",
    currency: "crystal",
    price: 300,
    quantity: 5,
    maxPurchase: 3,
    purchaseCount: 0,
    isLimited: true,
    rewards: [{ type: "fragment", id: "char-007", name: "Phoenix Lord Fragment", amount: 5 }],
  },
  // Items
  {
    id: "energy-refill",
    name: "Energy Refill",
    description: "Restore 10 Energy",
    category: "items",
    currency: "crystal",
    price: 20,
    quantity: 10,
    purchaseCount: 0,
    isLimited: false,
    rewards: [{ type: "item", name: "Energy", amount: 10 }],
  },
  {
    id: "exp-boost",
    name: "EXP Boost (1 Hour)",
    description: "Double EXP for 1 hour",
    category: "items",
    currency: "crystal",
    price: 50,
    quantity: 1,
    purchaseCount: 0,
    isLimited: false,
    rewards: [{ type: "item", name: "EXP Boost", amount: 1 }],
  },
  // Limited
  {
    id: "limited-bundle-1",
    name: "New Year Bundle",
    description: "Special New Year celebration bundle!",
    category: "limited",
    currency: "real",
    price: 19.99,
    originalPrice: 49.99,
    discount: 60,
    quantity: 1,
    maxPurchase: 1,
    purchaseCount: 0,
    isLimited: true,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    rewards: [
      { type: "crystal", name: "Crystals", amount: 2000 },
      { type: "coin", name: "Coins", amount: 100000 },
      { type: "fragment", id: "char-007", name: "Phoenix Lord Fragment", amount: 20 },
    ],
  },
];

export class MockShopRepository implements IShopRepository {
  private items: ShopItem[] = [...MOCK_SHOP_ITEMS];

  async getAll(): Promise<ShopItem[]> {
    await this.delay(100);
    return [...this.items];
  }

  async getByCategory(category: ShopCategory): Promise<ShopItem[]> {
    await this.delay(100);
    return this.items.filter((item) => item.category === category);
  }

  async getBundles(): Promise<ShopBundle[]> {
    await this.delay(100);
    return [
      {
        id: "starter-bundle",
        name: "Starter Bundle",
        description: "Perfect for new players!",
        currency: "real",
        price: 4.99,
        originalPrice: 14.99,
        discount: 67,
        items: this.items.slice(0, 3),
        isLimited: true,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  async getLimitedOffers(): Promise<ShopItem[]> {
    await this.delay(100);
    return this.items.filter((item) => item.isLimited);
  }

  async purchase(itemId: string, quantity = 1): Promise<ShopItem> {
    await this.delay(300);
    const index = this.items.findIndex((item) => item.id === itemId);
    if (index === -1) throw new Error("Item not found");

    const item = this.items[index];
    if (item.maxPurchase && item.purchaseCount >= item.maxPurchase) {
      throw new Error("Maximum purchase limit reached");
    }

    const updated: ShopItem = {
      ...item,
      purchaseCount: item.purchaseCount + quantity,
    };
    this.items[index] = updated;
    return updated;
  }

  async getStats(): Promise<ShopStats> {
    await this.delay(100);
    return {
      totalItems: this.items.length,
      limitedOffers: this.items.filter((i) => i.isLimited).length,
      dailyDealsRefreshIn: 8 * 60 * 60, // 8 hours in seconds
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockShopRepository = new MockShopRepository();
