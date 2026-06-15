/**
 * Standardized API response helpers.
 * Every endpoint returns: { success, message, data? }
 * This consistency makes frontend error handling trivial.
 */

const successResponse = (res, message, data = null, statusCode = 200) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
};

const errorResponse = (res, message, statusCode = 400, errors = null) => {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

module.exports = { successResponse, errorResponse };