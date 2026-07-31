const { getAuth, isDemo } = require('../config/firebase');
const { AppError } = require('../utils');

/**
 * AuthService – Handles authentication logic with Firebase Admin SDK.
 */
class AuthService {
  /**
   * Login user by verifying Firebase ID Token or processing credentials.
   * @param {{ idToken?: string, email?: string, password?: string }} params
   * @returns {Promise<object>} user session object
   */
  static async login({ idToken, email, password }) {
    // 1. If idToken is provided, verify it via Firebase Admin SDK
    if (idToken) {
      if (isDemo()) {
        return {
          user: {
            uid: 'usr_demo_001',
            email: email || 'demo@projectpilot.ai',
            name: 'Demo User',
            emailVerified: true,
          },
          token: idToken,
          status: 'authenticated',
        };
      }

      const auth = getAuth();
      const decodedToken = await auth.verifyIdToken(idToken);
      const userRecord = await auth.getUser(decodedToken.uid);

      return {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          name: userRecord.displayName || userRecord.email?.split('@')[0] || 'User',
          photoURL: userRecord.photoURL || null,
          emailVerified: userRecord.emailVerified,
          createdAt: userRecord.metadata.creationTime,
        },
        token: idToken,
        status: 'authenticated',
      };
    }

    // 2. If email & password provided (traditional / fallback)
    if (email && password) {
      if (!isDemo()) {
        // Firebase Admin doesn't verify raw passwords directly (client SDK handles sign-in),
        // so we check if the user exists in Firebase Auth.
        try {
          const auth = getAuth();
          const userRecord = await auth.getUserByEmail(email);
          return {
            user: {
              uid: userRecord.uid,
              email: userRecord.email,
              name: userRecord.displayName || 'User',
              emailVerified: userRecord.emailVerified,
            },
            status: 'pending_client_token',
          };
        } catch (_err) {
          throw new AppError('Invalid email or password.', 401);
        }
      }

      // Demo mode fallback
      return {
        user: {
          uid: 'usr_demo_001',
          email,
          name: 'Demo User',
          avatar: null,
        },
        token: 'stub_jwt_token',
        status: 'authenticated',
      };
    }

    throw new AppError('Missing authentication parameters. Provide idToken or email/password.', 400);
  }

  /**
   * Logout user by revoking refresh tokens (if uid available).
   * @param {string} uid
   * @returns {Promise<object>} logout confirmation
   */
  static async logout(uid) {
    if (!isDemo() && uid) {
      try {
        const auth = getAuth();
        await auth.revokeRefreshTokens(uid);
      } catch (error) {
        console.warn(`[AuthService] Token revocation failed for ${uid}:`, error.message);
      }
    }

    return {
      loggedOut: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Register a new user in Firebase Auth.
   * @param {{ email: string, password: string, name: string }} data
   * @returns {Promise<object>} created user object
   */
  static async register({ email, password, name }) {
    if (isDemo()) {
      return {
        user: {
          uid: 'usr_demo_002',
          email,
          name: name || 'New User',
          avatar: null,
        },
        token: 'stub_jwt_token',
      };
    }

    try {
      const auth = getAuth();
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name || '',
        emailVerified: false,
      });

      return {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          name: userRecord.displayName,
          emailVerified: userRecord.emailVerified,
        },
      };
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        throw new AppError('The email address is already in use by another account.', 409);
      }
      if (error.code === 'auth/invalid-password') {
        throw new AppError('Password must be at least 6 characters long.', 400);
      }
      throw new AppError(error.message, 400);
    }
  }
}

module.exports = AuthService;
