// Mock in-memory database with localStorage persistence.
export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  cover: string;
  bio: string;
  badge?: string;
  followers: string[]; // user ids
  following: string[];
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  text: string;
  createdAt: number;
};

export type Post = {
  id: string;
  authorId: string;
  text: string;
  image?: string;
  createdAt: number;
  likes: string[]; // user ids
  comments: Comment[];
};

type DB = { users: User[]; posts: Post[]; sessionUserId: string | null };

const KEY = "miniSocial.db.v1";

const seedUsers: User[] = [
  {
    id: "u_keshav",
    username: "keshav3w",
    name: "Keshav Mehta",
    email: "keshav@demo.app",
    password: "demo1234",
    avatar: "https://i.pravatar.cc/200?img=12",
    cover:
      "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1600&q=80&auto=format&fit=crop",
    bio: "Building delightful products ✨  Coffee · Code · Cricket",
    badge: "Legend",
    followers: ["u_pranshu", "u_aria", "u_niyam"],
    following: ["u_aria"],
  },
  {
    id: "u_pranshu",
    username: "singhzgpw",
    name: "Pranshu Singh",
    email: "pranshu@demo.app",
    password: "demo1234",
    avatar: "https://i.pravatar.cc/200?img=15",
    cover:
      "https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=1600&q=80&auto=format&fit=crop",
    bio: "Frontend dev. React + design systems.",
    followers: ["u_keshav"],
    following: ["u_keshav", "u_aria", "u_niyam"],
  },
  {
    id: "u_aria",
    username: "aria.codes",
    name: "Aria Patel",
    email: "aria@demo.app",
    password: "demo1234",
    avatar: "https://i.pravatar.cc/200?img=47",
    cover:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1600&q=80&auto=format&fit=crop",
    bio: "Designer · Illustrator · Cat parent 🐈",
    badge: "Creator",
    followers: ["u_keshav", "u_pranshu"],
    following: ["u_pranshu"],
  },
  {
    id: "u_niyam",
    username: "niyama9jhg",
    name: "Niyamath Shariff",
    email: "niyam@demo.app",
    password: "demo1234",
    avatar: "https://i.pravatar.cc/200?img=33",
    cover:
      "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=1600&q=80&auto=format&fit=crop",
    bio: "Travel + photography 📸",
    followers: [],
    following: ["u_keshav"],
  },
  {
    id: "u_mohamed",
    username: "ahemed98dj",
    name: "Mohamed Ahmed",
    email: "mo@demo.app",
    password: "demo1234",
    avatar: "https://i.pravatar.cc/200?img=68",
    cover:
      "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1600&q=80&auto=format&fit=crop",
    bio: "Engineer at heart.",
    followers: [],
    following: [],
  },
  {
    id: "u_biswa",
    username: "samanthzmv",
    name: "Biswajit Samanta",
    email: "bs@demo.app",
    password: "demo1234",
    avatar: "https://i.pravatar.cc/200?img=11",
    cover:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&q=80&auto=format&fit=crop",
    bio: "Cricket fan 🏏",
    followers: [],
    following: [],
  },
];

const now = Date.now();
const h = (n: number) => now - n * 3600 * 1000;

const seedPosts: Post[] = [
  {
    id: "p1",
    authorId: "u_keshav",
    text: "Hello guys 👋  How are you all doing today?",
    createdAt: h(16),
    likes: ["u_pranshu", "u_aria", "u_niyam"],
    comments: [
      { id: "c1", postId: "p1", authorId: "u_aria", text: "All good! 🚀", createdAt: h(15) },
      { id: "c2", postId: "p1", authorId: "u_niyam", text: "Doing great ✨", createdAt: h(14) },
    ],
  },
  {
    id: "p2",
    authorId: "u_aria",
    text: "Shipped a new illustration pack today — feedback welcome 💛",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80&auto=format&fit=crop",
    createdAt: h(20),
    likes: ["u_keshav", "u_pranshu"],
    comments: [
      { id: "c3", postId: "p2", authorId: "u_keshav", text: "Looks 🔥", createdAt: h(19) },
    ],
  },
  {
    id: "p3",
    authorId: "u_niyam",
    text: "Sunrise from this morning's trek. Worth every step.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format&fit=crop",
    createdAt: h(28),
    likes: ["u_keshav", "u_aria", "u_pranshu", "u_mohamed"],
    comments: [],
  },
  {
    id: "p4",
    authorId: "u_pranshu",
    text: "Hot take: dark mode > light mode. Fight me 😅",
    createdAt: h(40),
    likes: ["u_aria"],
    comments: [
      { id: "c4", postId: "p4", authorId: "u_mohamed", text: "Agreed 💯", createdAt: h(38) },
    ],
  },
  {
    id: "p5",
    authorId: "u_biswa",
    text: "QuizArena: Play & Earn Rewards — complete simple tasks and earn money. Download now!",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80&auto=format&fit=crop",
    createdAt: h(52),
    likes: ["u_pranshu", "u_niyam", "u_aria", "u_keshav"],
    comments: [
      { id: "c5", postId: "p5", authorId: "u_aria", text: "Sounds fun!", createdAt: h(50) },
    ],
  },
  {
    id: "p6",
    authorId: "u_mohamed",
    text: "Reading 'Designing Data-Intensive Applications' this week. Any chapter favorites?",
    createdAt: h(72),
    likes: ["u_keshav"],
    comments: [],
  },
  {
    id: "p7",
    authorId: "u_keshav",
    text: "Coffee #3 today. Send help ☕☕☕",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&auto=format&fit=crop",
    createdAt: h(90),
    likes: ["u_pranshu", "u_aria"],
    comments: [],
  },
];

function load(): DB {
  if (typeof window === "undefined")
    return { users: seedUsers, posts: seedPosts, sessionUserId: null };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const initial: DB = { users: seedUsers, posts: seedPosts, sessionUserId: null };
      localStorage.setItem(KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) as DB;
  } catch {
    return { users: seedUsers, posts: seedPosts, sessionUserId: null };
  }
}

let db: DB = load();

function persist() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(db));
}

export const mockDb = {
  get users() {
    return db.users;
  },
  get posts() {
    return db.posts;
  },
  get sessionUserId() {
    return db.sessionUserId;
  },
  setSession(id: string | null) {
    db.sessionUserId = id;
    persist();
  },
  addUser(u: User) {
    db.users.push(u);
    persist();
  },
  addPost(p: Post) {
    db.posts.unshift(p);
    persist();
  },
  toggleLike(postId: string, userId: string) {
    const p = db.posts.find((x) => x.id === postId);
    if (!p) return;
    p.likes = p.likes.includes(userId) ? p.likes.filter((i) => i !== userId) : [...p.likes, userId];
    persist();
  },
  addComment(c: Comment) {
    const p = db.posts.find((x) => x.id === c.postId);
    if (!p) return;
    p.comments.push(c);
    persist();
  },
  deletePost(id: string) {
    db.posts = db.posts.filter((p) => p.id !== id);
    persist();
  },
  reset() {
    db = { users: seedUsers, posts: seedPosts, sessionUserId: null };
    persist();
  },
};

export const delay = (ms = 450) => new Promise((res) => setTimeout(res, ms));
export const uid = () => Math.random().toString(36).slice(2, 10);
