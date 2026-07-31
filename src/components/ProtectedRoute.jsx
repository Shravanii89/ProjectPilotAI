import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute component wrapper.
 * Redirects unauthenticated users to /login page.
 */
function ProtectedRoute({ children }) {
  const { user, currentUser, loading } = useAuth()
  const location = useLocation()
  const activeUser = currentUser || user

  console.log(`[ProtectedRoute] Route check for "${location.pathname}". Loading: ${loading}, User: ${activeUser?.email || 'Unauthenticated'}`)

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#F8F6F1' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px', width: '32px', height: '32px' }}></div>
          <div style={{ color: '#4F46E5', fontWeight: '600', fontSize: '0.95rem' }}>Authenticating with ProjectPilot AI...</div>
        </div>
      </div>
    )
  }

  if (!activeUser) {
    console.warn(`[ProtectedRoute] Access denied to "${location.pathname}". Redirecting to /login`)
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
