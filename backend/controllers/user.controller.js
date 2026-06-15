const User = require("../models/user.model");
const Post = require("../models/post.model");
const { successResponse, errorResponse } = require("../utils/apiResponse");

/**
 * @route   GET /api/users/:username
 * @access  Public
 * @desc    Get a user's public profile and their posts
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) return errorResponse(res, "User not found", 404);

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate total likes and comments across all user's posts
    const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);

    const postsWithMeta = posts.map((post) => ({
      ...post,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
    }));

    // Check if current user follows this user
    const currentUserId = req.user?._id?.toString();
    const isFollowing = currentUserId ? user.followers.some(id => id.toString() === currentUserId) : false;

    return successResponse(res, "Profile fetched", {
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
        postCount: posts.length,
        totalLikes,
        totalComments,
        followers: user.followers,
        following: user.following,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        isFollowing,
      },
      posts: postsWithMeta,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /api/users/:userId/follow
 * @access  Private
 * @desc    Follow or unfollow a user
 */
const toggleFollow = async (req, res, next) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return errorResponse(res, "You cannot follow yourself", 400);
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return errorResponse(res, "User not found", 404);

    const isFollowing = targetUser.followers.includes(currentUserId);

    if (isFollowing) {
      // Unfollow: remove from both arrays
      await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
      
      return successResponse(res, `Unfollowed ${targetUser.username}`, {
        isFollowing: false,
        followersCount: targetUser.followers.length - 1,
      });
    } else {
      // Follow: add to both arrays
      await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });
      await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });
      
      return successResponse(res, `Now following ${targetUser.username}`, {
        isFollowing: true,
        followersCount: targetUser.followers.length + 1,
      });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/users/suggested
 * @access  Public
 * @desc    Get suggested users (most followers)
 */
const getSuggestedUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id;
    const limit = parseInt(req.query.limit) || 5;

    // Find users with most followers, excluding current user
    const query = currentUserId ? { _id: { $ne: currentUserId } } : {};
    
    const users = await User.find(query)
      .select("name username avatar bio followers")
      .lean()
      .limit(50); // Get more to filter

    // Sort by follower count and return top N
    const sortedUsers = users
      .map(user => ({
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        followersCount: (user.followers || []).length,
        isFollowing: currentUserId ? (user.followers || []).some(id => id.toString() === currentUserId.toString()) : false,
      }))
      .sort((a, b) => b.followersCount - a.followersCount)
      .slice(0, limit);

    return successResponse(res, "Suggested users fetched", { users: sortedUsers });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserProfile, toggleFollow, getSuggestedUsers };