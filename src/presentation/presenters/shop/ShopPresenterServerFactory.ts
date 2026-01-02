import { MockShopRepository } from "@/src/infrastructure/repositories/mock/MockShopRepository";
import { ShopPresenter } from "./ShopPresenter";

export function createServerShopPresenter(): ShopPresenter {
  return new ShopPresenter(new MockShopRepository());
}
