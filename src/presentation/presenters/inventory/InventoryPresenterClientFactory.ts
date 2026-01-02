"use client";

import { MockInventoryRepository } from "@/src/infrastructure/repositories/mock/MockInventoryRepository";
import { InventoryPresenter } from "./InventoryPresenter";

export function createClientInventoryPresenter(): InventoryPresenter {
  return new InventoryPresenter(new MockInventoryRepository());
}
