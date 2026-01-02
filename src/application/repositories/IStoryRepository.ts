/**
 * IStoryRepository
 * Repository interface for Story/Campaign data access
 */

export type Difficulty = "normal" | "hard" | "extreme";
export type StageStatus = "locked" | "available" | "completed" | "3star";

export interface Story {
  id: string;
  name: string;
  description: string;
  chapters: Chapter[];
  totalChapters: number;
  completedChapters: number;
}

export interface Chapter {
  id: string;
  storyId: string;
  number: number;
  name: string;
  description: string;
  stages: Stage[];
  totalStages: number;
  completedStages: number;
  isUnlocked: boolean;
  rewards: Reward[];
}

export interface Stage {
  id: string;
  chapterId: string;
  number: number;
  name: string;
  description: string;
  difficulty: Difficulty;
  status: StageStatus;
  stars: number;
  maxStars: number;
  energyCost: number;
  recommendedPower: number;
  enemies: Enemy[];
  rewards: Reward[];
  firstClearRewards: Reward[];
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  power: number;
  element: string;
  imageUrl?: string;
}

export interface Reward {
  type: "crystal" | "coin" | "fragment" | "item" | "character";
  id?: string;
  name: string;
  amount: number;
  imageUrl?: string;
}

export interface StoryStats {
  totalChapters: number;
  completedChapters: number;
  totalStages: number;
  completedStages: number;
  totalStars: number;
  earnedStars: number;
}

export interface IStoryRepository {
  getAll(): Promise<Story[]>;
  getById(id: string): Promise<Story | null>;
  getChapter(chapterId: string): Promise<Chapter | null>;
  getStage(stageId: string): Promise<Stage | null>;
  completeStage(stageId: string, stars: number): Promise<Stage>;
  getStats(): Promise<StoryStats>;
}
