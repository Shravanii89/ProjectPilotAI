const { AuthService } = require('../services');
const { catchAsync, sendResponse } = require('../utils');

/**
 * POST /api/auth/login (and POST /api/auth)
 * Authenticate user with idToken or email/password.
 */
exports.login = catchAsync(async (req, res) => {
  const { idToken, email, password } = req.body;
  const result = await AuthService.login({ idToken, email, password });

  sendResponse(res, 200, 'User authenticated successfully.', result);
});

// Alias for authenticate
exports.authenticate = exports.login;

/**
 * POST /api/auth/logout
 * Revoke tokens & logout authenticated user.
 */
exports.logout = catchAsync(async (req, res) => {
  const uid = req.user ? req.user.uid : null;
  const result = await AuthService.logout(uid);

  sendResponse(res, 200, 'Logout successful.', result);
});

/**
 * POST /api/auth/register
 * Register a new user account.
 */
exports.register = catchAsync(async (req, res) => {
  const { email, password, name } = req.body;
  const result = await AuthService.register({ email, password, name });

  sendResponse(res, 201, 'Registration successful.', result);
});

/**
 * GET /api/auth/me
 * Get current authenticated user profile stored in req.user.
 */
exports.getMe = catchAsync(async (req, res) => {
  sendResponse(res, 200, 'Authenticated user profile retrieved.', req.user);
});
