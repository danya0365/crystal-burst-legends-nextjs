import { MockPvpRepository } from "@/src/infrastructure/repositories/mock/MockPvpRepository";
import { PvpPresenter } from "./PvpPresenter";

export function createServerPvpPresenter(): PvpPresenter {
  return new PvpPresenter(new MockPvpRepository());
}
