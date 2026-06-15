const mongoose = require("mongoose");

/**
 * POST SCHEMA
 *
 * Stores all post data including embedded likes and comments.
 * Also supports polls with options and votes.
 */

// ─── Comment Sub-document ────────────────────────────────────────────
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ─── Poll Option Sub-document ─────────────────────────────────────────
const pollOptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, "Poll option cannot exceed 200 characters"],
  },
  votes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
});

// ─── Post Schema ─────────────────────────────────────────────────────
const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorUsername: {
      type: String,
      required: true,
    },
    authorAvatar: {
      type: String,
    },
    
    // Post type: "post" or "poll"
    type: {
      type: String,
      enum: ["post", "poll"],
      default: "post",
    },

    // Post content (for regular posts)
    content: {
      type: String,
      trim: true,
      maxlength: [2000, "Post content cannot exceed 2000 characters"],
    },
    image: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },

    // Poll fields (for poll posts)
    pollQuestion: {
      type: String,
      trim: true,
      maxlength: [500, "Poll question cannot exceed 500 characters"],
    },
    pollOptions: [pollOptionSchema],
    pollDuration: {
      type: Number, // Duration in hours
      default: 24,
    },
    pollEndsAt: {
      type: Date,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual Fields ─────────────────────────────────────────────────
postSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

postSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

postSchema.virtual("totalVotes").get(function () {
  if (this.type !== "poll" || !this.pollOptions) return 0;
  return this.pollOptions.reduce((sum, opt) => sum + opt.votes.length, 0);
});

// ─── Indexes ────────────────────────────────────────────────────────
postSchema.index({ createdAt: -1 });
postSchema.index({ content: "text" });
postSchema.index({ type: 1 });

// ─── Validation ──────────────────────────────────────────────────────
postSchema.pre("validate", function (next) {
  if (this.type === "post") {
    // Regular post: need content or image
    if (!this.content && !this.image) {
      this.invalidate("content", "Post must have either text content or an image");
    }
  } else if (this.type === "poll") {
    // Poll post: need question and at least 2 options
    if (!this.pollQuestion) {
      this.invalidate("pollQuestion", "Poll must have a question");
    }
    if (!this.pollOptions || this.pollOptions.length < 2) {
      this.invalidate("pollOptions", "Poll must have at least 2 options");
    }
    // Set poll end time if not set
    if (!this.pollEndsAt && this.pollDuration) {
      this.pollEndsAt = new Date(Date.now() + this.pollDuration * 60 * 60 * 1000);
    }
  }
  next();
});

module.exports = mongoose.model("Post", postSchema);