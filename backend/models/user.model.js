const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * USER SCHEMA
 *
 * Only two collections are used: users + posts.
 * This schema stores authentication data and public profile info.
 */
const userSchema = new mongoose.Schema(
  {
    // Display name shown on posts and profile
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    // Unique handle used for @mentions and URL slugs; lowercased on save
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
    },

    // Primary login credential; never exposed in responses
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    // Hashed via bcrypt in pre-save hook; minimum 6 chars enforced at validator level
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Never returned in queries by default
    },

    // Cloudinary URL for avatar; defaults to a DiceBear avatar based on username
    avatar: {
      type: String,
      default: function () {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.username}`;
      },
    },

    // Optional bio shown on profile page
    bio: {
      type: String,
      maxlength: [160, "Bio cannot exceed 160 characters"],
      default: "",
    },

    // Users who follow this user
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Users this user is following
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
    // Remove __v version key from outputs
    versionKey: false,
    // Custom toJSON transform to strip sensitive fields
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

// ─── Indexes ────────────────────────────────────────────────────────
// Compound text index for search functionality on name/username
userSchema.index({ name: "text", username: "text" });

// ─── Pre-save Hook: Hash password ───────────────────────────────────
userSchema.pre("save", async function (next) {
  // Only re-hash if password field was modified
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12); // Cost factor 12 = good security/perf balance
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Method: Compare passwords ─────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);