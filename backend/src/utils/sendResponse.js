/**
 * Sends a consistent JSON success response.
 *
 * @param {import('express').Response} res
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {*} [data] - Response payload
 * @param {object} [meta] - Optional metadata (pagination, etc.)
 */
const sendResponse = (res, statusCode, message, data = null, meta = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;

  res.status(statusCode).json(response);
};

module.exports = sendResponse;
