/**
 * StoryPresenter
 * Handles business logic for Story mode
 */

import {
    Chapter,
    IStoryRepository,
    Stage,
    Story,
    StoryStats,
} from "@/src/application/repositories/IStoryRepository";
import { Metadata } from "next";

export interface StoryViewModel {
  stories: Story[];
  selectedStory: Story | null;
  selectedChapter: Chapter | null;
  selectedStage: Stage | null;
  stats: StoryStats;
}

export class StoryPresenter {
  constructor(private readonly repository: IStoryRepository) {}

  async getViewModel(): Promise<StoryViewModel> {
    const [stories, stats] = await Promise.all([
      this.repository.getAll(),
      this.repository.getStats(),
    ]);

    return {
      stories,
      selectedStory: stories[0] || null,
      selectedChapter: null,
      selectedStage: null,
      stats,
    };
  }

  generateMetadata(): Metadata {
    return {
      title: "Story Mode | Crystal Burst Legends",
      description: "Battle through epic story chapters in Crystal Burst Legends",
    };
  }

  async getChapter(chapterId: string): Promise<Chapter | null> {
    return this.repository.getChapter(chapterId);
  }

  async getStage(stageId: string): Promise<Stage | null> {
    return this.repository.getStage(stageId);
  }

  async completeStage(stageId: string, stars: number): Promise<Stage> {
    return this.repository.completeStage(stageId, stars);
  }

  async getStats(): Promise<StoryStats> {
    return this.repository.getStats();
  }
}
