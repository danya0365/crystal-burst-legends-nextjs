import { ISummonRepository, SummonBanner, SummonResult, SummonStats } from "@/src/application/repositories/ISummonRepository";
import { Metadata } from "next";

export interface SummonViewModel {
  banners: SummonBanner[];
  selectedBanner: SummonBanner | null;
  stats: SummonStats;
  lastResult: SummonResult | null;
}

export class SummonPresenter {
  constructor(private readonly repository: ISummonRepository) {}

  async getViewModel(): Promise<SummonViewModel> {
    const [banners, stats] = await Promise.all([
      this.repository.getBanners(),
      this.repository.getStats(),
    ]);
    return { banners, selectedBanner: banners[0] || null, stats, lastResult: null };
  }

  generateMetadata(): Metadata {
    return { title: "Summon | Crystal Burst Legends", description: "Summon new characters in Crystal Burst Legends" };
  }

  async summonSingle(bannerId: string): Promise<SummonResult> {
    return this.repository.summonSingle(bannerId);
  }

  async summonMulti(bannerId: string): Promise<SummonResult> {
    return this.repository.summonMulti(bannerId);
  }
}
