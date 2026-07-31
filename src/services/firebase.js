import { initializeApp, getApps } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth'

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {}

// Fallback configuration matching projectpilotai-b76e3
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyAypPkp7WzzM1JC7yNAgidsxfCgZgKeQQ4',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'projectpilotai-b76e3.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'projectpilotai-b76e3',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'projectpilotai-b76e3.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '23301218142',
  appId: env.VITE_FIREBASE_APP_ID || '1:23301218142:web:a504a7bbe67be6d45fb9cf',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || 'G-821XVB7YLS',
}

let app
let auth
let googleProvider
let analytics

try {
  console.log('[Firebase Init] Loading configuration for Project ID:', firebaseConfig.projectId)
  console.log('[Firebase Init] API Key status:', firebaseConfig.apiKey ? 'Valid key loaded' : 'Missing key')

  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  auth = getAuth(app)
  googleProvider = new GoogleAuthProvider()
  googleProvider.setCustomParameters({ prompt: 'select_account' })

  console.log('[Firebase Init] ✅ Web SDK successfully initialized.')

  isSupported()
    .then((supported) => {
      if (supported && firebaseConfig.measurementId) {
        analytics = getAnalytics(app)
        console.log('[Firebase Init] Analytics initialized.')
      }
    })
    .catch((err) => console.warn('[Firebase Analytics] Warning:', err.message))
} catch (e) {
  console.error('[Firebase Init] ❌ Initialization failed:', e.message)
}

/**
 * Translates Firebase Auth error codes into specific, detailed error messages.
 */
export function getFirebaseErrorMessage(error) {
  if (!error) return 'An unexpected error occurred.'
  const code = error.code || ''
  const msg = error.message || ''

  console.error(`[Firebase Auth Error] Code: ${code} | Message: ${msg}`)

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please check your credentials. (auth/invalid-credential)'
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. (auth/email-already-in-use)'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long. (auth/weak-password)'
    case 'auth/invalid-email':
      return 'The email address format is invalid. (auth/invalid-email)'
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing authentication. (auth/popup-closed-by-user)'
    case 'auth/user-disabled':
      return 'This user account has been disabled. (auth/user-disabled)'
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection. (auth/network-request-failed)'
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please try again later. (auth/too-many-requests)'
    default:
      return msg || 'Authentication error occurred. Please try again.'
  }
}

/**
 * Register user with Email, Password & Display Name
 */
export async function signUpWithEmail(email, password, displayName = '') {
  console.log(`[Firebase Auth] Registering new user: ${email}`)
  if (!auth) throw new Error('Firebase Auth is not initialized.')

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log(`[Firebase Auth] ✅ Account created successfully. UID: ${user.uid}`)

    if (displayName) {
      try {
        await updateProfile(user, { displayName })
        console.log(`[Firebase Auth] Display name updated: "${displayName}"`)
      } catch (perr) {
        console.warn('[Firebase Auth] Display name update warning:', perr.message)
      }
    }

    try {
      await sendEmailVerification(user)
      console.log('[Firebase Auth] Verification email sent to:', email)
    } catch (verr) {
      console.warn('[Firebase Auth] Verification email warning:', verr.message)
    }

    return user
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error))
  }
}

/**
 * Login user with Email & Password
 */
export async function signInWithEmail(email, password, rememberMe = true) {
  console.log(`[Firebase Auth] Attempting email sign in for: ${email}`)
  if (!auth) throw new Error('Firebase Auth is not initialized.')

  try {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence
    await setPersistence(auth, persistence)
    console.log(`[Firebase Auth] Auth persistence set to: ${rememberMe ? 'LOCAL' : 'SESSION'}`)

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log(`[Firebase Auth] ✅ Email sign in successful. UID: ${userCredential.user.uid}`)
    return userCredential.user
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error))
  }
}

/**
 * Login / Register with Google Provider
 */
export async function signInWithGoogle() {
  console.log('[Firebase Auth] Initiating Google Sign-In popup...')
  if (!auth || !googleProvider) throw new Error('Firebase Auth or Google Provider is not initialized.')

  try {
    const userCredential = await signInWithPopup(auth, googleProvider)
    console.log(`[Firebase Auth] ✅ Google Sign-In successful. User: ${userCredential.user.email} (${userCredential.user.uid})`)
    return userCredential.user
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error))
  }
}

/**
 * Send Password Reset Email
 */
export async function resetPassword(email) {
  console.log(`[Firebase Auth] Sending password reset email to: ${email}`)
  if (!auth) throw new Error('Firebase Auth is not initialized.')

  try {
    await sendPasswordResetEmail(auth, email)
    console.log('[Firebase Auth] ✅ Password reset email sent.')
    return true
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error))
  }
}

/**
 * Resend Email Verification
 */
export async function resendVerificationEmail() {
  console.log('[Firebase Auth] Resending email verification...')
  if (!auth || !auth.currentUser) throw new Error('No active user logged in to send verification email.')

  try {
    await sendEmailVerification(auth.currentUser)
    console.log('[Firebase Auth] ✅ Email verification sent.')
    return true
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error))
  }
}

/**
 * Logout User
 */
export async function logoutUser() {
  console.log('[Firebase Auth] Logging out user...')
  if (!auth) return true

  try {
    await signOut(auth)
    console.log('[Firebase Auth] ✅ User signed out successfully.')
    return true
  } catch (error) {
    console.error('[Firebase Auth] Logout error:', error.message)
    throw new Error(getFirebaseErrorMessage(error))
  }
}

/**
 * Listen to Auth State Changes
 */
export function onAuthChange(callback) {
  if (!auth) {
    console.warn('[Firebase Auth] Cannot attach onAuthStateChanged listener: Auth not initialized.')
    callback(null)
    return () => {}
  }
  console.log('[Firebase Auth] Attaching onAuthStateChanged listener...')
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(`[Firebase Auth Listener] Active session found: ${user.email} (${user.uid})`)
    } else {
      console.log('[Firebase Auth Listener] No active user session.')
    }
    callback(user)
  })
}

export { app, auth, analytics }
