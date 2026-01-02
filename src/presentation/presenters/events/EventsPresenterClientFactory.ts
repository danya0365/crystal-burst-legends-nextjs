"use client";

import { MockEventRepository } from "@/src/infrastructure/repositories/mock/MockEventRepository";
import { EventsPresenter } from "./EventsPresenter";

export function createClientEventsPresenter(): EventsPresenter {
  return new EventsPresenter(new MockEventRepository());
}
