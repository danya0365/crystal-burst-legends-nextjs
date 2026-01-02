import { Friend, FriendRequest, ISocialRepository, SocialStats } from "@/src/application/repositories/ISocialRepository";
import { Metadata } from "next";

export interface SocialViewModel {
  friends: Friend[];
  requests: FriendRequest[];
  stats: SocialStats;
}

export class SocialPresenter {
  constructor(private readonly repository: ISocialRepository) {}

  async getViewModel(): Promise<SocialViewModel> {
    const [friends, requests, stats] = await Promise.all([
      this.repository.getFriends(),
      this.repository.getFriendRequests(),
      this.repository.getStats(),
    ]);
    return { friends, requests, stats };
  }

  generateMetadata(): Metadata {
    return {
      title: "Social | Crystal Burst Legends",
      description: "Friends & social features",
    };
  }

  async acceptRequest(requestId: string) {
    return this.repository.acceptRequest(requestId);
  }

  async rejectRequest(requestId: string) {
    return this.repository.rejectRequest(requestId);
  }

  async removeFriend(friendId: string) {
    return this.repository.removeFriend(friendId);
  }

  async searchPlayers(query: string) {
    return this.repository.searchPlayers(query);
  }
}
