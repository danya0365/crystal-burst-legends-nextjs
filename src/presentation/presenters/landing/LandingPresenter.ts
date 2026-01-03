/**
 * LandingPresenter
 * Handles business logic for Landing page
 */

import {
    ILandingRepository,
    LandingContent,
} from "@/src/application/repositories/ILandingRepository";
import { Metadata } from "next";

export interface LandingViewModel {
  content: LandingContent;
}

export class LandingPresenter {
  constructor(private readonly repository: ILandingRepository) {}

  async getViewModel(): Promise<LandingViewModel> {
    const content = await this.repository.getContent();
    return { content };
  }

  generateMetadata(): Metadata {
    return {
      title: "Crystal Burst Legends - Epic Gacha RPG",
      description: "Embark on an epic adventure, collect legendary heroes, and battle your way to glory!",
    };
  }
}
