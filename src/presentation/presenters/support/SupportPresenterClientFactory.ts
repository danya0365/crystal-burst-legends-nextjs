"use client";

import { MockSupportRepository } from "@/src/infrastructure/repositories/mock/MockSupportRepository";
import { SupportPresenter } from "./SupportPresenter";

export function createClientSupportPresenter(): SupportPresenter {
  return new SupportPresenter(new MockSupportRepository());
}
