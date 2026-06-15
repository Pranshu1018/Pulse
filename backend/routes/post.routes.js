const express = require("express");
const router = express.Router();
const {
  createPost, getAllPosts, getPostById, toggleLike, addComment, deletePost, votePoll,
} = require("../controllers/post.controller");
const { protect } = require("../middleware/auth.middleware");
const { upload } = require("../config/cloudinary");
const { createPostValidators, commentValidators } = require("../validators/post.validators");
const { validate } = require("../middleware/validate.middleware");

// Optional auth middleware — attaches req.user if token present, doesn't block if absent
const optionalAuth = async (req, res, next) => {
  const { protect: protectFn } = require("../middleware/auth.middleware");
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return protectFn(req, res, next);
  }
  next();
};

// GET /api/posts          — public (isLiked flag needs optional auth)
router.get("/", optionalAuth, getAllPosts);

// GET /api/posts/:id      — public
router.get("/:id", optionalAuth, getPostById);

// POST /api/posts         — private, supports image upload
router.post("/", protect, upload.single("image"), createPostValidators, validate, createPost);

// POST /api/posts/:id/like   — private (toggle like/unlike)
router.post("/:id/like", protect, toggleLike);

// POST /api/posts/:id/vote   — private (vote on poll)
router.post("/:id/vote", protect, votePoll);

// POST /api/posts/:id/comments — private
router.post("/:id/comments", protect, commentValidators, validate, addComment);

// DELETE /api/posts/:id   — private (author only)
router.delete("/:id", protect, deletePost);

module.exports = router;