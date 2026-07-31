const { Router } = require('express');
const { authController } = require('../controllers');
const { authValidation, authenticateToken } = require('../middleware');

const router = Router();

/**
 * POST /api/auth/login
 * Login user via Firebase ID token or email/password.
 */
router.post('/login', authController.login);

/**
 * POST /api/auth
 * Legacy/Alias route for login.
 */
router.post('/', authController.authenticate);

/**
 * POST /api/auth/logout
 * Logout authenticated user & revoke refresh tokens.
 */
router.post('/logout', authenticateToken, authController.logout);

/**
 * POST /api/auth/register
 * Register a new user.
 */
router.post('/register', authValidation, authController.register);

/**
 * GET /api/auth/me
 * Get current authenticated user details.
 */
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
