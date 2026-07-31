import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Dashboard/Sidebar'
import Header from '../components/Dashboard/Header'
import '../styles/Settings.css'

function Settings() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSidebarTab, setActiveSidebarTab] = useState('Settings')

  // Active Settings Section Tab
  const [activeSection, setActiveSection] = useState('profile')

  // Profile Form State
  const [name, setName] = useState('')
  const [title, setTitle] = useState('Innovation Lead & Founder')
  const [bio, setBio] = useState('Building next-gen AI tools for idea validation and patent intelligence.')

  // Account Form State
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // Theme State (initialized from localStorage)
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('projectpilot_theme') || 'light'
  })

  // Notifications State
  const [notifyAnalysis, setNotifyAnalysis] = useState(true)
  const [notifySecurity, setNotifySecurity] = useState(true)
  const [notifyMarketing, setNotifyMarketing] = useState(false)

  // Modal & Toast State
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toast, setToast] = useState('')

  // Update theme on document root & save to localStorage whenever themeMode changes
  useEffect(() => {
    console.log(`[Theme Manager] Applying theme mode: "${themeMode}"`)
    document.documentElement.setAttribute('data-theme', themeMode)
    localStorage.setItem('projectpilot_theme', themeMode)
  }, [themeMode])

  useEffect(() => {
    if (user) {
      setName(user.displayName || '')
      setEmail(user.email || '')
    }
  }, [user])

  const showFeedback = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    showFeedback('Profile information updated successfully!')
  }

  const handleSaveAccount = (e) => {
    e.preventDefault()
    showFeedback('Account credentials updated successfully!')
  }

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false)
    await logout()
    showFeedback('Account deleted. Redirecting...')
    setTimeout(() => {
      navigate('/login')
    }, 1500)
  }

  return (
    <div className="settings-layout">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeTab={activeSidebarTab}
        setActiveTab={setActiveSidebarTab}
      />

      <div className="settings-main">
        <Header setMobileOpen={setMobileOpen} />

        <main className="settings-content">
          <div className="settings-page-header">
            <h1 className="settings-page-title">Account Settings</h1>
            <p className="settings-page-subtitle">
              Manage your profile preferences, theme modes, notifications, and security credentials.
            </p>
          </div>

          {toast && (
            <div className="auth-alert success" style={{ marginBottom: '24px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>{toast}</span>
            </div>
          )}

          <div className="settings-grid">
            {/* Left Navigation Tabs */}
            <nav className="settings-nav">
              <button
                className={`settings-nav-btn ${activeSection === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveSection('profile')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Profile
              </button>

              <button
                className={`settings-nav-btn ${activeSection === 'account' ? 'active' : ''}`}
                onClick={() => setActiveSection('account')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Account & Auth
              </button>

              <button
                className={`settings-nav-btn ${activeSection === 'theme' ? 'active' : ''}`}
                onClick={() => setActiveSection('theme')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
                Theme Preferences
              </button>

              <button
                className={`settings-nav-btn ${activeSection === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveSection('notifications')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                Notifications
              </button>

              <button
                className={`settings-nav-btn danger ${activeSection === 'danger' ? 'active' : ''}`}
                onClick={() => setActiveSection('danger')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Danger Zone
              </button>
            </nav>

            {/* Right Section Content */}
            <div className="settings-main-area">
              {/* SECTION: PROFILE */}
              {activeSection === 'profile' && (
                <div className="settings-section-card">
                  <h2 className="section-card-title">Profile Information</h2>
                  <p className="section-card-subtitle">
                    Update your public profile details and avatar.
                  </p>

                  <div className="avatar-section">
                    <div className="avatar-large">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <span>{user?.initials || 'U'}</span>
                      )}
                    </div>
                    <div>
                      <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.8125rem' }}>
                        Change Avatar
                      </button>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-subtext)', marginTop: '6px' }}>
                        JPG, GIF or PNG. Max size of 2MB.
                      </div>
                    </div>
                  </div>

                  <form className="auth-form" onSubmit={handleSaveProfile}>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Title / Role</label>
                      <input
                        type="text"
                        className="form-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Bio</label>
                      <textarea
                        className="idea-textarea"
                        style={{ minHeight: '100px' }}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* SECTION: ACCOUNT & AUTH */}
              {activeSection === 'account' && (
                <div className="settings-section-card">
                  <h2 className="section-card-title">Account & Security</h2>
                  <p className="section-card-subtitle">
                    Manage your email address, password, and connected OAuth providers.
                  </p>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label">Connected OAuth Accounts</label>
                    <div className="connected-account-card">
                      <div className="connected-info">
                        <svg width="22" height="22" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z"/>
                          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2 0 10.04 0 12s.46 3.8 1.27 5.42l4.01-3.15z"/>
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                        </svg>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text)' }}>
                            Firebase / Google Account
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-subtext)' }}>
                            {email}
                          </div>
                        </div>
                      </div>
                      <span className="connected-badge">Connected</span>
                    </div>
                  </div>

                  <form className="auth-form" onSubmit={handleSaveAccount}>
                    <div className="form-group">
                      <label className="form-label">Update Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                      <button type="submit" className="btn btn-primary">
                        Update Security Credentials
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* SECTION: THEME */}
              {activeSection === 'theme' && (
                <div className="settings-section-card">
                  <h2 className="section-card-title">Theme Preferences</h2>
                  <p className="section-card-subtitle">
                    Customize the appearance and visual layout of ProjectPilot AI.
                  </p>

                  <div className="toggle-row">
                    <div>
                      <div className="toggle-info-title">Warm Beige (Light Mode)</div>
                      <div className="toggle-info-sub">Default warm beige theme (#F8F6F1) with crisp contrast</div>
                    </div>
                    <label className="switch">
                      <input
                        type="radio"
                        name="theme"
                        checked={themeMode === 'light'}
                        onChange={() => {
                          setThemeMode('light')
                          showFeedback('Applied Warm Beige Light theme.')
                        }}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="toggle-row">
                    <div>
                      <div className="toggle-info-title">Sleek Dark Mode</div>
                      <div className="toggle-info-sub">Dark ambient palette (#0F172A) for night usage</div>
                    </div>
                    <label className="switch">
                      <input
                        type="radio"
                        name="theme"
                        checked={themeMode === 'dark'}
                        onChange={() => {
                          setThemeMode('dark')
                          showFeedback('Applied Sleek Dark theme mode.')
                        }}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              )}

              {/* SECTION: NOTIFICATIONS */}
              {activeSection === 'notifications' && (
                <div className="settings-section-card">
                  <h2 className="section-card-title">Notification Settings</h2>
                  <p className="section-card-subtitle">
                    Configure how and when you receive notifications from ProjectPilot AI.
                  </p>

                  <div className="toggle-row">
                    <div>
                      <div className="toggle-info-title">Analysis Completed</div>
                      <div className="toggle-info-sub">Notify when an idea validation scan completes</div>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notifyAnalysis}
                        onChange={(e) => {
                          setNotifyAnalysis(e.target.checked)
                          showFeedback('Updated notification preference.')
                        }}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="toggle-row">
                    <div>
                      <div className="toggle-info-title">Security & Auth Alerts</div>
                      <div className="toggle-info-sub">Receive instant alerts for logins from new devices</div>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notifySecurity}
                        onChange={(e) => {
                          setNotifySecurity(e.target.checked)
                          showFeedback('Updated notification preference.')
                        }}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="toggle-row">
                    <div>
                      <div className="toggle-info-title">Product News & Features</div>
                      <div className="toggle-info-sub">Receive updates on new AI analysis models and features</div>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notifyMarketing}
                        onChange={(e) => {
                          setNotifyMarketing(e.target.checked)
                          showFeedback('Updated notification preference.')
                        }}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              )}

              {/* SECTION: DANGER ZONE */}
              {activeSection === 'danger' && (
                <div className="settings-section-card danger-card">
                  <h2 className="section-card-title danger-title">Danger Zone</h2>
                  <p className="section-card-subtitle" style={{ borderColor: 'rgba(220, 38, 38, 0.2)' }}>
                    Irreversible account management actions.
                  </p>

                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>
                      Delete ProjectPilot AI Account
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-subtext)', marginBottom: '20px' }}>
                      Once you delete your account, all idea history, saved patent reports, and innovation scores will be permanently purged. This action cannot be undone.
                    </p>

                    <button
                      className="btn"
                      style={{ background: 'var(--color-danger)', color: 'white' }}
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delete Account Modal Confirmation */}
          {showDeleteModal && (
            <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
              <div className="report-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
                <div className="modal-header">
                  <h2 className="history-page-title danger-title" style={{ fontSize: '1.25rem' }}>
                    Confirm Account Deletion
                  </h2>
                  <button
                    className="close-modal-btn"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--color-subtext)', marginBottom: '24px', lineHeight: '1.6' }}>
                  Are you sure you want to delete your account? All saved ideas and innovation reports will be permanently lost.
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn"
                    style={{ background: 'var(--color-danger)', color: 'white' }}
                    onClick={handleDeleteAccount}
                  >
                    Yes, Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Settings
