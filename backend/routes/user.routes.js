const express = require("express");
const router = express.Router();
const { getUserProfile, toggleFollow, getSuggestedUsers } = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

// Optional auth middleware
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return protect(req, res, next);
  }
  next();
};

// GET /api/users/suggested — get users with most followers
router.get("/suggested", optionalAuth, getSuggestedUsers);

// GET /api/users/:username — public profile
router.get("/:username", optionalAuth, getUserProfile);

// POST /api/users/:userId/follow — toggle follow (protected)
router.post("/:userId/follow", protect, toggleFollow);

module.exports = router;