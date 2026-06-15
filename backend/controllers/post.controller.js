const Post = require("../models/post.model");
const { cloudinary } = require("../config/cloudinary");
const { successResponse, errorResponse } = require("../utils/apiResponse");

/**
 * @route   POST /api/posts
 * @access  Private
 * @desc    Create a new post (text, image, or both)
 */
const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    const imageUrl = req.file?.path || null;
    const imagePublicId = req.file?.filename || null;

    // At least one field must be present (also enforced at model level)
    if (!content && !imageUrl) {
      return errorResponse(res, "Post must have text content or an image", 422);
    }

    const post = await Post.create({
      author: req.user._id,
      authorName: req.user.name,
      authorUsername: req.user.username,
      authorAvatar: req.user.avatar,
      content: content || null,
      image: imageUrl,
      imagePublicId,
    });

    return successResponse(res, "Post created successfully", { post }, 201);
  } catch (err) {
    // Handle Cloudinary-specific errors
    if (err.message?.includes('cloud_name is disabled') || err.http_code === 401) {
      return errorResponse(res, "Image upload is temporarily unavailable. Please post without an image or check Cloudinary configuration.", 503);
    }
    next(err);
  }
};

/**
 * @route   GET /api/posts
 * @access  Public
 * @desc    Get paginated feed of all posts (newest first)
 * @query   page, limit, search
 */
const getAllPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();

    // Build query filter
    const filter = {};
    if (search) {
      filter.$text = { $search: search };
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // lean() returns plain JS objects — faster for read-only
      Post.countDocuments(filter),
    ]);

    // Attach isLiked flag for the authenticated user (if any)
    const userId = req.user?._id?.toString();
    const postsWithMeta = posts.map((post) => ({
      ...post,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
      isLiked: userId ? post.likes.map(String).includes(userId) : false,
      // Trim full comments array — only send latest 3 for feed; full list via single post
      comments: post.comments.slice(-3),
    }));

    return successResponse(res, "Posts fetched", {
      posts: postsWithMeta,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasMore: page * limit < total,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/posts/:id
 * @access  Public
 * @desc    Get a single post with all comments
 */
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) return errorResponse(res, "Post not found", 404);

    const userId = req.user?._id?.toString();
    const postWithMeta = {
      ...post,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
      isLiked: userId ? post.likes.map(String).includes(userId) : false,
    };

    return successResponse(res, "Post fetched", { post: postWithMeta });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /api/posts/:id/like
 * @access  Private
 * @desc    Toggle like on a post (like if not liked, unlike if already liked)
 */
const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return errorResponse(res, "Post not found", 404);

    const userId = req.user._id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // $pull removes the userId from the likes array
      await Post.findByIdAndUpdate(req.params.id, { $pull: { likes: userId } });
    } else {
      // $addToSet prevents duplicate likes (belt-and-suspenders with the check above)
      await Post.findByIdAndUpdate(req.params.id, { $addToSet: { likes: userId } });
    }

    const updatedPost = await Post.findById(req.params.id).lean();
    return successResponse(res, alreadyLiked ? "Post unliked" : "Post liked", {
      likeCount: updatedPost.likes.length,
      isLiked: !alreadyLiked,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /api/posts/:id/comments
 * @access  Private
 * @desc    Add a comment to a post
 */
const addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return errorResponse(res, "Post not found", 404);

    const comment = {
      user: req.user._id,
      username: req.user.username,
      avatar: req.user.avatar,
      text: req.body.text.trim(),
    };

    // $push appends to the embedded comments array
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment } },
      { new: true, runValidators: true }
    );

    const newComment = updatedPost.comments[updatedPost.comments.length - 1];

    return successResponse(res, "Comment added", {
      comment: newComment,
      commentCount: updatedPost.comments.length,
    }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   DELETE /api/posts/:id
 * @access  Private
 * @desc    Delete a post (author only)
 */
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return errorResponse(res, "Post not found", 404);

    // Authorization check — only the author can delete
    if (post.author.toString() !== req.user._id.toString()) {
      return errorResponse(res, "You are not authorized to delete this post", 403);
    }

    // Try to delete image from Cloudinary if it exists (don't fail if Cloudinary is not configured)
    if (post.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(post.imagePublicId);
      } catch (cloudinaryErr) {
        console.warn("Failed to delete image from Cloudinary:", cloudinaryErr.message);
        // Continue with post deletion even if Cloudinary fails
      }
    }

    await Post.findByIdAndDelete(req.params.id);
    return successResponse(res, "Post deleted successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /api/posts/:id/vote
 * @access  Private
 * @desc    Vote on a poll option
 */
const votePoll = async (req, res, next) => {
  try {
    const { optionIndex } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) return errorResponse(res, "Post not found", 404);
    if (post.type !== "poll") return errorResponse(res, "This post is not a poll", 400);
    if (!post.pollOptions[optionIndex]) return errorResponse(res, "Invalid poll option", 400);
    
    // Check if poll has ended
    if (post.pollEndsAt && new Date() > post.pollEndsAt) {
      return errorResponse(res, "This poll has ended", 400);
    }

    const userId = req.user._id;
    
    // Remove user's vote from all options (can only vote once)
    post.pollOptions.forEach(opt => {
      opt.votes = opt.votes.filter(id => !id.equals(userId));
    });
    
    // Add vote to selected option
    post.pollOptions[optionIndex].votes.push(userId);
    await post.save();

    const updatedPost = await Post.findById(req.params.id).lean();
    return successResponse(res, "Vote recorded", { 
      pollOptions: updatedPost.pollOptions,
      totalVotes: updatedPost.pollOptions.reduce((sum, opt) => sum + opt.votes.length, 0),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createPost, getAllPosts, getPostById, toggleLike, addComment, deletePost, votePoll };