import { MockSupportRepository } from "@/src/infrastructure/repositories/mock/MockSupportRepository";
import { SupportPresenter } from "./SupportPresenter";

export function createServerSupportPresenter(): SupportPresenter {
  return new SupportPresenter(new MockSupportRepository());
}
