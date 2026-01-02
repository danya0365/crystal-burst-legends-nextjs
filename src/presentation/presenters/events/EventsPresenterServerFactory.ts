import { MockEventRepository } from "@/src/infrastructure/repositories/mock/MockEventRepository";
import { EventsPresenter } from "./EventsPresenter";

export function createServerEventsPresenter(): EventsPresenter {
  return new EventsPresenter(new MockEventRepository());
}
