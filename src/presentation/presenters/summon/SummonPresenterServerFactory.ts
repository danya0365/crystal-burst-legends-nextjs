import { MockSummonRepository } from "@/src/infrastructure/repositories/mock/MockSummonRepository";
import { SummonPresenter } from "./SummonPresenter";

export function createServerSummonPresenter(): SummonPresenter {
  return new SummonPresenter(new MockSummonRepository());
}
