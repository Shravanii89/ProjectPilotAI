const admin = require('firebase-admin');
const config = require('./index');

/**
 * Firebase Admin SDK initialisation.
 *
 * Supports two modes:
 *   1. Service account JSON file  →  set FIREBASE_SERVICE_ACCOUNT_PATH
 *   2. Individual env vars        →  set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL,
 *                                     FIREBASE_PRIVATE_KEY
 *
 * Falls back to demo mode if neither is configured, so the app
 * never crashes during local development without credentials.
 */

let firebaseApp = null;
let isDemoMode = false;

const initFirebase = () => {
  if (firebaseApp) return firebaseApp;

  try {
    // ── Option 1: Service account JSON file ──
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      console.log('✅ Firebase Admin initialised with service account file.');
      return firebaseApp;
    }

    // ── Option 2: Individual environment variables ──
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Private key comes in with literal \n; convert to real newlines
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });

      console.log('✅ Firebase Admin initialised with env credentials.');
      return firebaseApp;
    }

    // ── Option 3: Demo mode ──
    isDemoMode = true;
    console.warn(
      '⚠️  [Firebase Admin] No credentials found. Running in DEMO mode — token verification is bypassed.'
    );
    return null;
  } catch (err) {
    isDemoMode = true;
    console.error('❌ Firebase Admin init failed:', err.message);
    console.warn('⚠️  Falling back to DEMO mode.');
    return null;
  }
};

// Initialise on first require
initFirebase();

/**
 * Return the Firebase Auth instance (or null in demo mode).
 */
const getAuth = () => {
  if (isDemoMode) return null;
  return admin.auth();
};

/**
 * @returns {boolean} true when Firebase credentials are not configured
 */
const isDemo = () => isDemoMode;

module.exports = { getAuth, isDemo, admin };
