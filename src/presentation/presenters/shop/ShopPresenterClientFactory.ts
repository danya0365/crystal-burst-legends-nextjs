"use client";
import { MockShopRepository } from "@/src/infrastructure/repositories/mock/MockShopRepository";
import { ShopPresenter } from "./ShopPresenter";

export function createClientShopPresenter(): ShopPresenter {
  return new ShopPresenter(new MockShopRepository());
}
