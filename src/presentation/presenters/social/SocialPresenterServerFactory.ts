import { MockSocialRepository } from "@/src/infrastructure/repositories/mock/MockSocialRepository";
import { SocialPresenter } from "./SocialPresenter";

export function createServerSocialPresenter(): SocialPresenter {
  return new SocialPresenter(new MockSocialRepository());
}
