import { MockMailRepository } from "@/src/infrastructure/repositories/mock/MockMailRepository";
import { MailPresenter } from "./MailPresenter";

export function createServerMailPresenter(): MailPresenter {
  return new MailPresenter(new MockMailRepository());
}
