import { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthChange,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  logoutUser,
} from '../services/firebase'

const AuthContext = createContext({
  user: null,
  currentUser: null,
  loading: true,
  loginWithEmail: async () => {},
  loginWithGoogle: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('[AuthContext] Subscribing to Firebase Auth state listener...')
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        const displayName =
          firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
        const email = firebaseUser.email || ''
        const photoURL = firebaseUser.photoURL || null
        const uid = firebaseUser.uid

        const initials = displayName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)

        const userObj = {
          uid,
          email,
          displayName,
          photoURL,
          initials: initials || 'U',
          emailVerified: firebaseUser.emailVerified,
        }

        console.log('[AuthContext] Session populated:', userObj.email, `(UID: ${uid})`)
        setUser(userObj)
      } else {
        console.log('[AuthContext] Session cleared: user is unauthenticated.')
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const loginWithEmail = async (email, password, rememberMe = true) => {
    console.log('[AuthContext] Execution: loginWithEmail for', email)
    const firebaseUser = await signInWithEmail(email, password, rememberMe)
    return firebaseUser
  }

  const loginWithGoogle = async () => {
    console.log('[AuthContext] Execution: loginWithGoogle')
    const firebaseUser = await signInWithGoogle()
    return firebaseUser
  }

  const registerWithEmail = async (email, password, displayName) => {
    console.log('[AuthContext] Execution: registerWithEmail for', email)
    const firebaseUser = await signUpWithEmail(email, password, displayName)
    return firebaseUser
  }

  const logout = async () => {
    console.log('[AuthContext] Execution: logout')
    await logoutUser()
    setUser(null)
  }

  const value = {
    user,
    currentUser: user, // Alias so both user and currentUser work everywhere
    loading,
    loginWithEmail,
    loginWithGoogle,
    registerWithEmail,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
