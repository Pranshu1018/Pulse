const { body } = require("express-validator");

const createPostValidators = [
  body("content")
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage("Content cannot exceed 2000 characters"),
];

const commentValidators = [
  body("text")
    .trim()
    .notEmpty().withMessage("Comment text is required")
    .isLength({ max: 500 }).withMessage("Comment cannot exceed 500 characters"),
];

module.exports = { createPostValidators, commentValidators };