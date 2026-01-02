import { IProfileRepository, PlayerProfile, PlayerStats } from "@/src/application/repositories/IProfileRepository";
import { Metadata } from "next";

export interface ProfileViewModel {
  profile: PlayerProfile;
  stats: PlayerStats;
}

export class ProfilePresenter {
  constructor(private readonly repository: IProfileRepository) {}

  async getViewModel(): Promise<ProfileViewModel> {
    const [profile, stats] = await Promise.all([
      this.repository.getProfile(),
      this.repository.getStats(),
    ]);
    return { profile, stats };
  }

  generateMetadata(): Metadata {
    return {
      title: "Profile | Crystal Burst Legends",
      description: "Your player profile",
    };
  }

  async updateName(name: string) {
    return this.repository.updateName(name);
  }

  async updateAvatar(avatar: string) {
    return this.repository.updateAvatar(avatar);
  }
}
