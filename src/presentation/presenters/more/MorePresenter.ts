/**
 * MorePresenter
 * Presenter for More page business logic
 */

import type {
    IMoreRepository,
    MoreContent,
} from "@/src/application/repositories/IMoreRepository";

export interface MoreViewModel {
  menuItems: {
    id: string;
    label: string;
    description: string;
    icon: string;
    href: string;
    color: string;
  }[];
  gameInfo: {
    name: string;
    version: string;
  };
}

export interface MoreMetadata {
  title: string;
  description: string;
}

export class MorePresenter {
  constructor(private readonly repository: IMoreRepository) {}

  async getViewModel(): Promise<MoreViewModel> {
    const content: MoreContent = await this.repository.getMoreContent();

    return {
      menuItems: content.menuItems,
      gameInfo: content.gameInfo,
    };
  }

  getMetadata(): MoreMetadata {
    return {
      title: "More | Crystal Burst Legends",
      description: "Access additional features and settings",
    };
  }
}
