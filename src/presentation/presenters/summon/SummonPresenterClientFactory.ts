"use client";
import { MockSummonRepository } from "@/src/infrastructure/repositories/mock/MockSummonRepository";
import { SummonPresenter } from "./SummonPresenter";

export function createClientSummonPresenter(): SummonPresenter {
  return new SummonPresenter(new MockSummonRepository());
}
