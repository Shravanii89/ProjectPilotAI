const { getAuth, isDemo } = require('../config/firebase');
const { AppError, catchAsync } = require('../utils');

/**
 * Authentication Middleware
 * Verifies Firebase ID Token passed in Authorization header: "Bearer <token>"
 * Stores authenticated user information in req.user
 */
const authenticateToken = catchAsync(async (req, _res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Authentication required. Please provide a valid Bearer token.', 401);
  }

  // ── DEMO MODE FALLBACK ──
  if (isDemo()) {
    // In demo mode without live Firebase keys, accept demo/stub tokens cleanly
    req.user = {
      uid: 'usr_demo_001',
      email: 'demo@projectpilot.ai',
      name: 'Demo User',
      picture: null,
      emailVerified: true,
      authTime: Math.floor(Date.now() / 1000),
      isDemoUser: true,
    };
    return next();
  }

  // ── REAL FIREBASE ID TOKEN VERIFICATION ──
  try {
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);

    // Attach user profile info to req.user
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      name: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
      picture: decodedToken.picture || null,
      emailVerified: Boolean(decodedToken.email_verified),
      authTime: decodedToken.auth_time,
      firebase: decodedToken.firebase,
    };

    next();
  } catch (error) {
    if (error.code === 'auth/id-token-expired') {
      throw new AppError('Token has expired. Please log in again.', 401);
    }
    if (error.code === 'auth/argument-error' || error.code === 'auth/invalid-id-token') {
      throw new AppError('Invalid authentication token.', 401);
    }
    throw new AppError(`Authentication failed: ${error.message}`, 401);
  }
});

/**
 * Optional Authentication Middleware
 * If token is present, verifies it and populates req.user.
 * If token is missing, proceeds without failing.
 */
const optionalAuth = catchAsync(async (req, _res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  if (isDemo()) {
    req.user = {
      uid: 'usr_demo_001',
      email: 'demo@projectpilot.ai',
      name: 'Demo User',
      isDemoUser: true,
    };
    return next();
  }

  try {
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      name: decodedToken.name || 'User',
      picture: decodedToken.picture || null,
      emailVerified: Boolean(decodedToken.email_verified),
    };
  } catch (_err) {
    req.user = null;
  }

  next();
});

module.exports = {
  authenticateToken,
  optionalAuth,
};
