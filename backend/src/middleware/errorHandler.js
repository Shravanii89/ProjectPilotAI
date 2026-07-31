const config = require('../config');
const { AppError } = require('../utils');

/**
 * Centralized error-handling middleware.
 * Must be registered LAST with app.use(errorHandler).
 */

// ── Helper: send development error (verbose) ──
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// ── Helper: send production error (sanitised) ──
const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming / unknown error – don't leak details
    console.error('💥 UNEXPECTED ERROR:', err);
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ── Transform known third-party errors into AppErrors ──
const handleValidationError = (err) => {
  // express-validator errors forwarded as an array
  if (Array.isArray(err.errors)) {
    const messages = err.errors.map((e) => e.msg).join('. ');
    return new AppError(messages, 422);
  }
  return new AppError(err.message, 422);
};

const handleMulterError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError(
      `File too large. Maximum size is ${config.upload.maxFileSize / (1024 * 1024)}MB.`,
      413
    );
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Unexpected file field.', 400);
  }
  return new AppError(`Upload error: ${err.message}`, 400);
};

const handleJSONSyntaxError = () =>
  new AppError('Invalid JSON in request body.', 400);

// ── Main handler ──
const errorHandler = (err, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.isDev) {
    return sendDevError(err, res);
  }

  // Clone so we don't mutate the original
  let error = { ...err, message: err.message, stack: err.stack };

  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.name === 'MulterError') error = handleMulterError(err);
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = handleJSONSyntaxError();
  }

  sendProdError(error, res);
};

module.exports = errorHandler;
