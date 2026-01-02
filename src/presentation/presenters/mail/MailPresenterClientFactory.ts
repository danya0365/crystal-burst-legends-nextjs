"use client";

import { MockMailRepository } from "@/src/infrastructure/repositories/mock/MockMailRepository";
import { MailPresenter } from "./MailPresenter";

export function createClientMailPresenter(): MailPresenter {
  return new MailPresenter(new MockMailRepository());
}
