/**
 * ISocialRepository
 * Repository interface for Social/Friends data access
 */

export type FriendStatus = "online" | "offline" | "playing";

export interface Friend {
  id: string;
  name: string;
  level: number;
  power: number;
  status: FriendStatus;
  lastSeen?: string;
  avatar: string;
}

export interface FriendRequest {
  id: string;
  from: Friend;
  sentAt: string;
}

export interface SocialStats {
  friendsCount: number;
  maxFriends: number;
  pendingRequests: number;
}

export interface ISocialRepository {
  getFriends(): Promise<Friend[]>;
  getFriendRequests(): Promise<FriendRequest[]>;
  getStats(): Promise<SocialStats>;
  addFriend(playerId: string): Promise<void>;
  removeFriend(friendId: string): Promise<void>;
  acceptRequest(requestId: string): Promise<Friend>;
  rejectRequest(requestId: string): Promise<void>;
  searchPlayers(query: string): Promise<Friend[]>;
}
