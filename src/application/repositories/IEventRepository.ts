/**
 * IEventRepository
 * Repository interface for Events data access
 */

export type EventType = "limited" | "login" | "challenge" | "celebration";
export type EventStatus = "upcoming" | "active" | "ended";

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  banner: string;
  startDate: string;
  endDate: string;
  rewards: EventReward[];
  progress?: { current: number; target: number };
}

export interface EventReward {
  type: "crystal" | "coin" | "character" | "item";
  name: string;
  amount: number;
  claimed: boolean;
}

export interface IEventRepository {
  getAll(): Promise<GameEvent[]>;
  getActive(): Promise<GameEvent[]>;
  getByType(type: EventType): Promise<GameEvent[]>;
  claimReward(eventId: string, rewardIndex: number): Promise<EventReward>;
}
