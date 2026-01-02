"use client";

import { MockSocialRepository } from "@/src/infrastructure/repositories/mock/MockSocialRepository";
import { SocialPresenter } from "./SocialPresenter";

export function createClientSocialPresenter(): SocialPresenter {
  return new SocialPresenter(new MockSocialRepository());
}
