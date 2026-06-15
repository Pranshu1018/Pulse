import api from "../lib/api/axios";
import type { PublicUser } from "./auth";

export async function getUserByUsername(username: string): Promise<PublicUser | null> {
  try {
    const res: any = await api.get(`/users/${username}`);
    const user = res.data.user;
    return {
      ...user,
      id: user._id,
      followers: user.followers || [],
      following: user.following || [],
      followersCount: user.followersCount || 0,
      followingCount: user.followingCount || 0,
      postCount: user.postCount || 0,
      totalLikes: user.totalLikes || 0,
      totalComments: user.totalComments || 0,
      isFollowing: user.isFollowing || false,
      cover: user.cover || "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1600&q=80&auto=format&fit=crop",
    };
  } catch (err: any) {
    console.error("Failed to fetch user:", err);
    return null;
  }
}

export async function suggestedUsers(excludeId?: string): Promise<PublicUser[]> {
  try {
    const res: any = await api.get("/users/suggested", { params: { limit: 5 } });
    return (res.data.users || []).map((user: any) => ({
      ...user,
      id: user._id,
      followers: user.followers || [],
      following: user.following || [],
    }));
  } catch (err: any) {
    console.error("Failed to fetch suggested users:", err);
    return [];
  }
}

export async function toggleFollow(userId: string): Promise<{ isFollowing: boolean; followersCount: number }> {
  try {
    const res: any = await api.post(`/users/${userId}/follow`);
    return {
      isFollowing: res.data.isFollowing,
      followersCount: res.data.followersCount,
    };
  } catch (err: any) {
    console.error("Failed to toggle follow:", err);
    throw new Error(err.message || "Failed to toggle follow");
  }
}

export async function searchUsers(q: string): Promise<PublicUser[]> {
  // For now, return empty array since we don't have a search endpoint
  // You can implement this later with a backend endpoint
  return [];
}

export function userStats(userId: string) {
  // Since we get stats from the backend with the user profile, return defaults
  // These will be overridden by the actual data from the API
  return {
    posts: 0,
    likes: 0,
    comments: 0,
  };
}
