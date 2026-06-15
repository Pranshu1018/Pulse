import api from "../lib/api/axios";

export interface PublicUser {
  _id: string;
  id: string; // alias for compatibility
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  cover?: string;
  badge?: string;
  followers?: string[];
  following?: string[];
  followersCount?: number;
  followingCount?: number;
  postCount?: number;
  totalLikes?: number;
  totalComments?: number;
  isFollowing?: boolean;
  createdAt?: string;
}

export async function login(email: string, password: string): Promise<PublicUser> {
  try {
    const res: any = await api.post("/auth/login", { email, password });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    // Add id alias for compatibility
    return { ...user, id: user._id };
  } catch (err: any) {
    throw new Error(err.message || "Login failed");
  }
}

export async function signup(input: {
  username: string;
  email: string;
  password: string;
}): Promise<PublicUser> {
  try {
    const res: any = await api.post("/auth/signup", {
      name: input.username,
      username: input.username,
      email: input.email,
      password: input.password,
    });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    // Add id alias for compatibility
    return { ...user, id: user._id };
  } catch (err: any) {
    throw new Error(err.message || "Signup failed");
  }
}

export function logout() {
  localStorage.removeItem("token");
}

export function currentUser(): PublicUser | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  // Try to get cached user from sessionStorage
  const cachedUser = sessionStorage.getItem("currentUser");
  if (cachedUser) {
    try {
      const user = JSON.parse(cachedUser);
      return { ...user, id: user._id };
    } catch {
      return null;
    }
  }
  
  return null;
}

export async function getMe(): Promise<PublicUser> {
  try {
    const res: any = await api.get("/auth/me");
    const user = res.data.user;
    // Cache user in sessionStorage
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    return { ...user, id: user._id };
  } catch (err: any) {
    throw new Error(err.message || "Failed to fetch user");
  }
}
