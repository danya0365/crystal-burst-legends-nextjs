/**
 * MockStoryRepository
 * Mock implementation for Story data
 */

import {
    Chapter,
    Enemy,
    IStoryRepository,
    Reward,
    Stage,
    Story,
    StoryStats,
} from "@/src/application/repositories/IStoryRepository";

const createEnemies = (chapterNum: number, stageNum: number): Enemy[] => [
  {
    id: `enemy-${chapterNum}-${stageNum}-1`,
    name: `Dark Warrior ${chapterNum}-${stageNum}`,
    level: chapterNum * 10 + stageNum * 2,
    power: 1000 + chapterNum * 500 + stageNum * 100,
    element: ["fire", "water", "earth", "wind", "dark"][stageNum % 5],
  },
  {
    id: `enemy-${chapterNum}-${stageNum}-2`,
    name: `Shadow Beast ${chapterNum}-${stageNum}`,
    level: chapterNum * 10 + stageNum * 2 + 1,
    power: 1200 + chapterNum * 500 + stageNum * 100,
    element: ["dark", "fire", "water", "earth", "wind"][(stageNum + 1) % 5],
  },
];

const createRewards = (chapterNum: number, stageNum: number): Reward[] => [
  { type: "coin", name: "Coins", amount: 500 + chapterNum * 100 + stageNum * 50 },
  { type: "crystal", name: "Crystals", amount: 5 + chapterNum },
];

const createFirstClearRewards = (chapterNum: number, stageNum: number): Reward[] => [
  { type: "crystal", name: "Crystals", amount: 50 + chapterNum * 10 },
  { type: "fragment", name: "Character Fragment", id: "char-001", amount: 5 },
];

const createStages = (chapterId: string, chapterNum: number): Stage[] => {
  const stageCount = 5 + chapterNum;
  const completedCount = chapterNum <= 2 ? stageCount : chapterNum === 3 ? 3 : 0;

  return Array.from({ length: stageCount }, (_, i) => {
    const stageNum = i + 1;
    const isCompleted = stageNum <= completedCount;
    const isAvailable = stageNum <= completedCount + 1 && chapterNum <= 4;

    return {
      id: `stage-${chapterNum}-${stageNum}`,
      chapterId,
      number: stageNum,
      name: `Stage ${chapterNum}-${stageNum}`,
      description: `Battle through the ${["Dark Forest", "Crystal Cave", "Fire Mountain", "Ocean Temple", "Sky Fortress"][chapterNum % 5]}`,
      difficulty: stageNum <= 3 ? "normal" : stageNum <= 6 ? "hard" : "extreme",
      status: isCompleted ? (stageNum <= completedCount - 1 ? "3star" : "completed") : isAvailable ? "available" : "locked",
      stars: isCompleted ? (stageNum <= completedCount - 1 ? 3 : 2) : 0,
      maxStars: 3,
      energyCost: 5 + Math.floor(stageNum / 2),
      recommendedPower: 1000 + chapterNum * 1000 + stageNum * 200,
      enemies: createEnemies(chapterNum, stageNum),
      rewards: createRewards(chapterNum, stageNum),
      firstClearRewards: createFirstClearRewards(chapterNum, stageNum),
    };
  });
};

const createChapters = (storyId: string): Chapter[] => {
  return Array.from({ length: 5 }, (_, i) => {
    const chapterNum = i + 1;
    const stages = createStages(`chapter-${chapterNum}`, chapterNum);
    const completedStages = stages.filter((s) => s.status === "completed" || s.status === "3star").length;

    return {
      id: `chapter-${chapterNum}`,
      storyId,
      number: chapterNum,
      name: `Chapter ${chapterNum}: ${["Awakening", "The Dark Path", "Crystal Power", "Ocean's Fury", "Final Battle"][i]}`,
      description: `Episode ${chapterNum} of the main story`,
      stages,
      totalStages: stages.length,
      completedStages,
      isUnlocked: chapterNum <= 4,
      rewards: [
        { type: "crystal", name: "Crystals", amount: 100 * chapterNum },
        { type: "character", name: "New Character", id: `char-00${chapterNum}`, amount: 1 },
      ],
    };
  });
};

const MOCK_STORIES: Story[] = [
  {
    id: "main-story",
    name: "Main Story",
    description: "The epic journey begins! Battle through the darkness to save the Crystal Kingdom.",
    chapters: createChapters("main-story"),
    totalChapters: 5,
    completedChapters: 2,
  },
];

export class MockStoryRepository implements IStoryRepository {
  private stories: Story[] = MOCK_STORIES;

  async getAll(): Promise<Story[]> {
    await this.delay(100);
    return [...this.stories];
  }

  async getById(id: string): Promise<Story | null> {
    await this.delay(100);
    return this.stories.find((s) => s.id === id) || null;
  }

  async getChapter(chapterId: string): Promise<Chapter | null> {
    await this.delay(100);
    for (const story of this.stories) {
      const chapter = story.chapters.find((c) => c.id === chapterId);
      if (chapter) return chapter;
    }
    return null;
  }

  async getStage(stageId: string): Promise<Stage | null> {
    await this.delay(100);
    for (const story of this.stories) {
      for (const chapter of story.chapters) {
        const stage = chapter.stages.find((s) => s.id === stageId);
        if (stage) return stage;
      }
    }
    return null;
  }

  async completeStage(stageId: string, stars: number): Promise<Stage> {
    await this.delay(300);
    for (const story of this.stories) {
      for (const chapter of story.chapters) {
        const index = chapter.stages.findIndex((s) => s.id === stageId);
        if (index !== -1) {
          const stage = chapter.stages[index];
          const updated: Stage = {
            ...stage,
            status: stars === 3 ? "3star" : "completed",
            stars: Math.max(stage.stars, stars),
          };
          chapter.stages[index] = updated;

          // Unlock next stage
          if (index + 1 < chapter.stages.length) {
            chapter.stages[index + 1] = {
              ...chapter.stages[index + 1],
              status: chapter.stages[index + 1].status === "locked" ? "available" : chapter.stages[index + 1].status,
            };
          }

          return updated;
        }
      }
    }
    throw new Error("Stage not found");
  }

  async getStats(): Promise<StoryStats> {
    await this.delay(100);
    let totalChapters = 0;
    let completedChapters = 0;
    let totalStages = 0;
    let completedStages = 0;
    let totalStars = 0;
    let earnedStars = 0;

    for (const story of this.stories) {
      for (const chapter of story.chapters) {
        totalChapters++;
        if (chapter.completedStages === chapter.totalStages) completedChapters++;
        for (const stage of chapter.stages) {
          totalStages++;
          totalStars += stage.maxStars;
          if (stage.status === "completed" || stage.status === "3star") {
            completedStages++;
            earnedStars += stage.stars;
          }
        }
      }
    }

    return { totalChapters, completedChapters, totalStages, completedStages, totalStars, earnedStars };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockStoryRepository = new MockStoryRepository();
