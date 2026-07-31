import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resetPassword } from '../services/firebase'
import '../styles/Auth.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleReset = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      await resetPassword(email)
      setMessage('Password reset link sent! Check your inbox for instructions.')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to send password reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#4F46E5"/>
              <path d="M16 7L25 12.5V21.5L16 27L7 21.5V12.5L16 7Z" fill="white" fillOpacity="0.9"/>
              <path d="M16 7L25 12.5L16 18L7 12.5L16 7Z" fill="white"/>
              <circle cx="16" cy="16" r="2.5" fill="#4F46E5"/>
            </svg>
            <span>ProjectPilot</span>
            <span className="logo-badge">AI</span>
          </Link>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Enter your email and we'll send you a recovery link</p>
        </div>

        {error && (
          <div className="auth-alert error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="auth-alert success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>{message}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleReset}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? <div className="spinner"></div> : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-footer">
          Remembered your password?{' '}
          <Link to="/login" className="auth-link">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
