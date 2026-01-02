import {
    Friend,
    FriendRequest,
    ISocialRepository,
    SocialStats,
} from "@/src/application/repositories/ISocialRepository";

const MOCK_FRIENDS: Friend[] = [
  { id: "f1", name: "DragonSlayer99", level: 52, power: 45000, status: "online", avatar: "🧙" },
  { id: "f2", name: "CrystalQueen", level: 48, power: 42000, status: "playing", avatar: "👸" },
  { id: "f3", name: "ShadowNinja", level: 45, power: 38000, status: "offline", lastSeen: "2h ago", avatar: "🥷" },
  { id: "f4", name: "FireMaster", level: 41, power: 35000, status: "offline", lastSeen: "1d ago", avatar: "🔥" },
  { id: "f5", name: "IceWarrior", level: 38, power: 32000, status: "online", avatar: "❄️" },
];

const MOCK_REQUESTS: FriendRequest[] = [
  { id: "r1", from: { id: "p1", name: "NewPlayer123", level: 15, power: 12000, status: "online", avatar: "👤" }, sentAt: "2026-01-02T10:00:00Z" },
  { id: "r2", from: { id: "p2", name: "ProGamer", level: 60, power: 55000, status: "offline", avatar: "🎮" }, sentAt: "2026-01-01T15:00:00Z" },
];

const MOCK_SEARCH_RESULTS: Friend[] = [
  { id: "s1", name: "Player001", level: 25, power: 20000, status: "online", avatar: "🌟" },
  { id: "s2", name: "Player002", level: 30, power: 25000, status: "offline", avatar: "⚡" },
  { id: "s3", name: "Player003", level: 35, power: 30000, status: "playing", avatar: "🎯" },
];

export class MockSocialRepository implements ISocialRepository {
  private friends = [...MOCK_FRIENDS];
  private requests = [...MOCK_REQUESTS];

  async getFriends(): Promise<Friend[]> {
    await this.delay(100);
    return [...this.friends];
  }

  async getFriendRequests(): Promise<FriendRequest[]> {
    await this.delay(100);
    return [...this.requests];
  }

  async getStats(): Promise<SocialStats> {
    await this.delay(50);
    return {
      friendsCount: this.friends.length,
      maxFriends: 50,
      pendingRequests: this.requests.length,
    };
  }

  async addFriend(playerId: string): Promise<void> {
    await this.delay(150);
    // In real implementation, would send friend request
  }

  async removeFriend(friendId: string): Promise<void> {
    await this.delay(150);
    this.friends = this.friends.filter((f) => f.id !== friendId);
  }

  async acceptRequest(requestId: string): Promise<Friend> {
    await this.delay(150);
    const request = this.requests.find((r) => r.id === requestId);
    if (!request) throw new Error("Request not found");
    
    this.friends.push(request.from);
    this.requests = this.requests.filter((r) => r.id !== requestId);
    return request.from;
  }

  async rejectRequest(requestId: string): Promise<void> {
    await this.delay(100);
    this.requests = this.requests.filter((r) => r.id !== requestId);
  }

  async searchPlayers(query: string): Promise<Friend[]> {
    await this.delay(200);
    if (!query.trim()) return [];
    return MOCK_SEARCH_RESULTS.filter((p) => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
