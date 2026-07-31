import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { resendVerificationEmail } from '../services/firebase'
import '../styles/Auth.css'

function VerifyEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || 'your email'

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleResend = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await resendVerificationEmail()
      setMessage('Verification email sent again! Please check your inbox.')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unable to resend email. You can proceed to sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="auth-header">
          <Link to="/" className="auth-logo" style={{ justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#4F46E5"/>
              <path d="M16 7L25 12.5V21.5L16 27L7 21.5V12.5L16 7Z" fill="white" fillOpacity="0.9"/>
              <path d="M16 7L25 12.5L16 18L7 12.5L16 7Z" fill="white"/>
              <circle cx="16" cy="16" r="2.5" fill="#4F46E5"/>
            </svg>
            <span>ProjectPilot</span>
            <span className="logo-badge">AI</span>
          </Link>

          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(79, 70, 229, 0.08)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>

          <h1 className="auth-title">Verify Your Email</h1>
          <p className="auth-subtitle">
            We've sent a verification link to <strong style={{ color: 'var(--color-text)' }}>{email}</strong>.
            Please verify your email to unlock all features.
          </p>
        </div>

        {error && (
          <div className="auth-alert error">
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="auth-alert success">
            <span>{message}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Continue to Dashboard
          </button>

          <button
            onClick={handleResend}
            className="btn btn-outline"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? <div className="spinner"></div> : 'Resend Verification Email'}
          </button>
        </div>

        <div className="auth-footer" style={{ marginTop: '24px' }}>
          Wrong email address?{' '}
          <Link to="/register" className="auth-link">
            Change email
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
