const jwt = require("jsonwebtoken");

/**
 * Generate a signed JWT for the given user payload.
 * @param {Object} payload - Data to embed (typically { id, username })
 * @returns {string} Signed JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Verify and decode a JWT.
 * @param {string} token
 * @returns {Object} Decoded payload
 * @throws {JsonWebTokenError | TokenExpiredError}
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };