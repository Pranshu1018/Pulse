const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { errorResponse } = require("../utils/apiResponse");

/**
 * Protect middleware - verifies JWT token and attaches user to req
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for Bearer token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return errorResponse(res, "Not authorized, no token provided", 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token (exclude password)
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return errorResponse(res, "User not found", 401);
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return errorResponse(res, "Invalid token", 401);
    }
    if (err.name === "TokenExpiredError") {
      return errorResponse(res, "Token expired", 401);
    }
    return errorResponse(res, "Not authorized", 401);
  }
};

module.exports = { protect };
