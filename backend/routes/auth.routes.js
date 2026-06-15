const express = require("express");
const router = express.Router();
const { signup, login, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { signupValidators, loginValidators } = require("../validators/auth.validators");
const { validate } = require("../middleware/validate.middleware");

// POST /api/auth/signup
router.post("/signup", signupValidators, validate, signup);

// POST /api/auth/login
router.post("/login", loginValidators, validate, login);

// GET /api/auth/me  — protected
router.get("/me", protect, getMe);

module.exports = router;