const { validationResult } = require("express-validator");
const { errorResponse } = require("../utils/apiResponse");

/**
 * Runs after express-validator chains.
 * If any validation failed, returns a 422 with all error messages.
 * If all pass, calls next() to proceed to the controller.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return errorResponse(res, "Validation failed", 422, formattedErrors);
  }
  next();
};

module.exports = { validate };