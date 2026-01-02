/**
 * MockEventRepository
 */

import {
    EventReward,
    EventType,
    GameEvent,
    IEventRepository,
} from "@/src/application/repositories/IEventRepository";

const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

const MOCK_EVENTS: GameEvent[] = [
  {
    id: "e1",
    title: "New Year Celebration",
    description: "Celebrate the new year with special rewards!",
    type: "celebration",
    status: "active",
    banner: "🎆",
    startDate: yesterday.toISOString(),
    endDate: nextWeek.toISOString(),
    rewards: [
      { type: "crystal", name: "Crystals", amount: 500, claimed: true },
      { type: "coin", name: "Coins", amount: 50000, claimed: false },
      { type: "character", name: "Event Character", amount: 1, claimed: false },
    ],
    progress: { current: 3, target: 7 },
  },
  {
    id: "e2",
    title: "7-Day Login Bonus",
    description: "Login every day to earn rewards",
    type: "login",
    status: "active",
    banner: "📅",
    startDate: yesterday.toISOString(),
    endDate: nextWeek.toISOString(),
    rewards: [
      { type: "crystal", name: "Day 1", amount: 50, claimed: true },
      { type: "coin", name: "Day 2", amount: 5000, claimed: true },
      { type: "crystal", name: "Day 3", amount: 100, claimed: false },
      { type: "item", name: "Day 4", amount: 1, claimed: false },
    ],
    progress: { current: 2, target: 7 },
  },
  {
    id: "e3",
    title: "Crystal Challenge",
    description: "Complete challenges to earn crystals",
    type: "challenge",
    status: "active",
    banner: "💎",
    startDate: yesterday.toISOString(),
    endDate: tomorrow.toISOString(),
    rewards: [
      { type: "crystal", name: "Stage 1", amount: 100, claimed: true },
      { type: "crystal", name: "Stage 2", amount: 200, claimed: false },
      { type: "crystal", name: "Stage 3", amount: 500, claimed: false },
    ],
    progress: { current: 1, target: 3 },
  },
  {
    id: "e4",
    title: "Limited Banner: Dragon Lord",
    description: "Exclusive summon event for Dragon Lord",
    type: "limited",
    status: "active",
    banner: "🐉",
    startDate: yesterday.toISOString(),
    endDate: nextWeek.toISOString(),
    rewards: [
      { type: "crystal", name: "Summon Bonus", amount: 300, claimed: false },
    ],
    progress: { current: 5, target: 10 },
  },
  {
    id: "e5",
    title: "Coming Soon: Valentine's Day",
    description: "Special Valentine's event coming soon",
    type: "celebration",
    status: "upcoming",
    banner: "💝",
    startDate: nextWeek.toISOString(),
    endDate: new Date(nextWeek.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    rewards: [
      { type: "character", name: "Valentine Character", amount: 1, claimed: false },
    ],
  },
];

export class MockEventRepository implements IEventRepository {
  private events = [...MOCK_EVENTS];

  async getAll(): Promise<GameEvent[]> {
    await this.delay(100);
    return [...this.events];
  }

  async getActive(): Promise<GameEvent[]> {
    await this.delay(100);
    return this.events.filter((e) => e.status === "active");
  }

  async getByType(type: EventType): Promise<GameEvent[]> {
    await this.delay(100);
    return this.events.filter((e) => e.type === type);
  }

  async claimReward(eventId: string, rewardIndex: number): Promise<EventReward> {
    await this.delay(150);
    const eventIndex = this.events.findIndex((e) => e.id === eventId);
    if (eventIndex === -1) throw new Error("Event not found");
    
    const event = this.events[eventIndex];
    if (!event.rewards[rewardIndex]) throw new Error("Reward not found");
    if (event.rewards[rewardIndex].claimed) throw new Error("Already claimed");
    
    event.rewards[rewardIndex] = { ...event.rewards[rewardIndex], claimed: true };
    this.events[eventIndex] = event;
    return event.rewards[rewardIndex];
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
