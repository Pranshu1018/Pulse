import api from "../lib/api/axios";

export type FeedFilter = "all" | "for-you" | "most-liked" | "most-commented";

export interface Comment {
  _id: string;
  id: string; // alias
  user: string;
  username: string;
  avatar?: string;
  text: string;
  createdAt: string;
}

export interface EnrichedPost {
  _id: string;
  id: string; // alias
  author: {
    id: string;
    username: string;
    name: string;
    avatar: string;
    badge?: string;
  };
  authorId: string; // for compatibility
  text: string;
  content: string; // alias
  image?: string;
  createdAt: string | number;
  likes: string[];
  likeCount: number;
  isLiked: boolean;
  comments: Comment[];
  commentCount: number;
}

function enrichPost(p: any): EnrichedPost {
  return {
    ...p,
    id: p._id,
    text: p.content || "",
    content: p.content || "",
    authorId: p.author || p.authorId,
    author: {
      id: p.author || p.authorId,
      username: p.authorUsername,
      name: p.authorName,
      avatar: p.authorAvatar,
    },
    createdAt: p.createdAt,
    likeCount: p.likeCount || p.likes?.length || 0,
    commentCount: p.commentCount || p.comments?.length || 0,
    comments: (p.comments || []).map((c: any) => ({
      ...c,
      id: c._id,
    })),
  };
}

export async function listFeed(filter: FeedFilter = "all"): Promise<EnrichedPost[]> {
  try {
    const res: any = await api.get("/posts", { params: { page: 1, limit: 50 } });
    let posts = res.data.posts || [];
    
    // Apply sorting based on filter
    if (filter === "most-liked") {
      posts.sort((a: any, b: any) => (b.likeCount || 0) - (a.likeCount || 0));
    } else if (filter === "most-commented") {
      posts.sort((a: any, b: any) => (b.commentCount || 0) - (a.commentCount || 0));
    }
    
    return posts.map(enrichPost);
  } catch (err: any) {
    console.error("Failed to fetch feed:", err);
    throw new Error(err.message || "Failed to fetch posts");
  }
}

export async function listPostsByUser(userId: string): Promise<EnrichedPost[]> {
  try {
    const res: any = await api.get("/posts", { params: { page: 1, limit: 50 } });
    const posts = res.data.posts || [];
    return posts
      .filter((p: any) => p.author === userId || p.authorId === userId)
      .map(enrichPost);
  } catch (err: any) {
    console.error("Failed to fetch user posts:", err);
    throw new Error(err.message || "Failed to fetch user posts");
  }
}

export async function createPost(input: {
  authorId: string;
  text: string;
  image?: string;
}): Promise<EnrichedPost> {
  try {
    const formData = new FormData();
    if (input.text) formData.append("content", input.text);
    
    // If image is a base64 string or file
    if (input.image) {
      if (input.image.startsWith("data:")) {
        // Convert base64 to file
        const base64Response = await fetch(input.image);
        const blob = await base64Response.blob();
        formData.append("image", blob, "upload.jpg");
      } else if (input.image instanceof File) {
        formData.append("image", input.image);
      }
    }
    
    const res: any = await api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    return enrichPost(res.data.post);
  } catch (err: any) {
    console.error("Failed to create post:", err);
    throw new Error(err.message || "Failed to create post");
  }
}

export async function toggleLike(postId: string, userId: string) {
  try {
    await api.post(`/posts/${postId}/like`);
  } catch (err: any) {
    console.error("Failed to toggle like:", err);
    throw new Error(err.message || "Failed to update like");
  }
}

export async function addComment(postId: string, authorId: string, text: string): Promise<Comment> {
  try {
    const res: any = await api.post(`/posts/${postId}/comments`, { text });
    const comment = res.data.comment;
    return {
      ...comment,
      id: comment._id,
    };
  } catch (err: any) {
    console.error("Failed to add comment:", err);
    throw new Error(err.message || "Failed to add comment");
  }
}

export async function deletePost(id: string) {
  try {
    await api.delete(`/posts/${id}`);
  } catch (err: any) {
    console.error("Failed to delete post:", err);
    throw new Error(err.message || "Failed to delete post");
  }
}

export async function searchPosts(q: string): Promise<EnrichedPost[]> {
  try {
    const res: any = await api.get("/posts", { params: { search: q, page: 1, limit: 20 } });
    return (res.data.posts || []).map(enrichPost);
  } catch (err: any) {
    console.error("Failed to search posts:", err);
    throw new Error(err.message || "Failed to search posts");
  }
}
