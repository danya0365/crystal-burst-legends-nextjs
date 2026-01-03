/**
 * GachaPresenter
 * Handles business logic for Gacha/Summon page
 */

import {
    GachaBanner,
    GachaPullResult,
    GachaRates,
    IGachaRepository,
    PityInfo,
} from "@/src/application/repositories/IGachaRepository";
import { Metadata } from "next";

export interface GachaViewModel {
  banners: GachaBanner[];
  rates: GachaRates;
  pityInfo: PityInfo;
  crystals: number;
  singleCost: { crystals: number };
  multiCost: { crystals: number; discount?: number };
}

export class GachaPresenter {
  constructor(private readonly repository: IGachaRepository) {}

  async getViewModel(): Promise<GachaViewModel> {
    const [banners, rates, pityInfo, crystals, singleCost, multiCost] = await Promise.all([
      this.repository.getActiveBanners(),
      this.repository.getRates(),
      this.repository.getPityInfo(),
      this.repository.getCrystals(),
      this.repository.getPullCost("single"),
      this.repository.getPullCost("multi"),
    ]);

    return {
      banners,
      rates,
      pityInfo,
      crystals,
      singleCost,
      multiCost,
    };
  }

  generateMetadata(): Metadata {
    return {
      title: "Summon | Crystal Burst Legends",
      description: "Summon powerful heroes with crystals",
    };
  }

  async pullSingle(bannerId: string): Promise<GachaPullResult> {
    return this.repository.pullSingle(bannerId);
  }

  async pullMulti(bannerId: string): Promise<GachaPullResult[]> {
    return this.repository.pullMulti(bannerId);
  }

  async canAffordPull(type: "single" | "multi"): Promise<boolean> {
    return this.repository.canAffordPull(type);
  }
}
