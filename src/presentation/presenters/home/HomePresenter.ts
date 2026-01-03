/**
 * HomePresenter
 * Presenter for Home page business logic
 */

import type {
    HomeContent,
    IHomeRepository,
} from "@/src/application/repositories/IHomeRepository";

export interface HomeViewModel {
  hero: {
    title: string;
    subtitle: string;
    featuredCharacter: {
      name: string;
      description: string;
      emoji: string;
    };
  };
  quickActions: {
    id: string;
    label: string;
    href: string;
    icon: string;
    variant: "primary" | "secondary" | "ghost";
  }[];
  news: {
    id: string;
    title: string;
    content: string;
    isNew: boolean;
  }[];
}

export interface HomeMetadata {
  title: string;
  description: string;
}

export class HomePresenter {
  constructor(private readonly repository: IHomeRepository) {}

  async getViewModel(): Promise<HomeViewModel> {
    const content: HomeContent = await this.repository.getHomeContent();

    return {
      hero: content.hero,
      quickActions: content.quickActions,
      news: content.news.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        isNew: item.isNew,
      })),
    };
  }

  getMetadata(): HomeMetadata {
    return {
      title: "Crystal Burst Legends",
      description: "Start your adventure in the world of Crystal Burst Legends!",
    };
  }
}
