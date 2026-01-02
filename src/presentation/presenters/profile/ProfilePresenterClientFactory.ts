"use client";

import { MockProfileRepository } from "@/src/infrastructure/repositories/mock/MockProfileRepository";
import { ProfilePresenter } from "./ProfilePresenter";

export function createClientProfilePresenter(): ProfilePresenter {
  return new ProfilePresenter(new MockProfileRepository());
}
