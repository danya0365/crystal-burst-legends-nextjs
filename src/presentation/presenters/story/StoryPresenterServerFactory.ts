import { MockStoryRepository } from "@/src/infrastructure/repositories/mock/MockStoryRepository";
import { StoryPresenter } from "./StoryPresenter";

export function createServerStoryPresenter(): StoryPresenter {
  return new StoryPresenter(new MockStoryRepository());
}
