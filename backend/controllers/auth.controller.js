const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt.utils");
const { successResponse, errorResponse } = require("../utils/apiResponse");

/**
 * @route   POST /api/auth/signup
 * @access  Public
 * @desc    Register a new user
 */
const signup = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    // Check for existing email or username — return specific error messages
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return errorResponse(res, "Email is already registered", 409);

    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) return errorResponse(res, "Username is already taken", 409);

    const user = await User.create({ name, username, email, password });
    const token = generateToken({ id: user._id, username: user.username });

    return successResponse(
      res,
      "Account created successfully",
      {
        token,
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          createdAt: user.createdAt,
        },
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /api/auth/login
 * @access  Public
 * @desc    Authenticate user and return JWT
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password (it's excluded by default via select: false)
    const user = await User.findOne({ email }).select("+password");
    if (!user) return errorResponse(res, "Invalid email or password", 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return errorResponse(res, "Invalid email or password", 401);

    const token = generateToken({ id: user._id, username: user.username });

    return successResponse(res, "Login successful", {
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/auth/me
 * @access  Private
 * @desc    Get the currently authenticated user's profile
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is already attached by the protect middleware
    return successResponse(res, "Profile fetched", { user: req.user });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, getMe };