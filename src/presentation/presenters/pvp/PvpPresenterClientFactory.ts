"use client";
import { MockPvpRepository } from "@/src/infrastructure/repositories/mock/MockPvpRepository";
import { PvpPresenter } from "./PvpPresenter";

export function createClientPvpPresenter(): PvpPresenter {
  return new PvpPresenter(new MockPvpRepository());
}
