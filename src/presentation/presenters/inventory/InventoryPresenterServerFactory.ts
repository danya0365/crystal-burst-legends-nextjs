import { MockInventoryRepository } from "@/src/infrastructure/repositories/mock/MockInventoryRepository";
import { InventoryPresenter } from "./InventoryPresenter";

export function createServerInventoryPresenter(): InventoryPresenter {
  return new InventoryPresenter(new MockInventoryRepository());
}
