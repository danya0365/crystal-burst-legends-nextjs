import { GameEvent, IEventRepository } from "@/src/application/repositories/IEventRepository";
import { Metadata } from "next";

export interface EventsViewModel {
  events: GameEvent[];
  activeCount: number;
}

export class EventsPresenter {
  constructor(private readonly repository: IEventRepository) {}

  async getViewModel(): Promise<EventsViewModel> {
    const events = await this.repository.getAll();
    return {
      events,
      activeCount: events.filter((e) => e.status === "active").length,
    };
  }

  generateMetadata(): Metadata {
    return {
      title: "Events | Crystal Burst Legends",
      description: "Limited-time events and special rewards",
    };
  }

  async claimReward(eventId: string, rewardIndex: number) {
    return this.repository.claimReward(eventId, rewardIndex);
  }
}
