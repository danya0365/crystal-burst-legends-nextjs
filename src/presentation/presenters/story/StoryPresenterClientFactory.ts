"use client";

import { MockStoryRepository } from "@/src/infrastructure/repositories/mock/MockStoryRepository";
import { StoryPresenter } from "./StoryPresenter";

export function createClientStoryPresenter(): StoryPresenter {
  return new StoryPresenter(new MockStoryRepository());
}
