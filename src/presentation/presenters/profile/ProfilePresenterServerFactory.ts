import { MockProfileRepository } from "@/src/infrastructure/repositories/mock/MockProfileRepository";
import { ProfilePresenter } from "./ProfilePresenter";

export function createServerProfilePresenter(): ProfilePresenter {
  return new ProfilePresenter(new MockProfileRepository());
}
