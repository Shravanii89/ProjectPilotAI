import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Header.css'

function Header({ setMobileOpen }) {
  const { user, currentUser } = useAuth()
  const activeUser = currentUser || user
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const displayName = activeUser?.displayName || 'User'
  const email = activeUser?.email || 'user@projectpilot.ai'
  const initials = activeUser?.initials || 'PP'

  const notifications = [
    { id: 1, text: 'Analysis for "AI Code Assistant" complete!', time: '5m ago', unread: true },
    { id: 2, text: 'New patent match found in USPTO database', time: '1h ago', unread: true },
    { id: 3, text: 'Monthly Innovation Score report is ready', time: '1d ago', unread: false },
  ]

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="mobile-toggle" onClick={() => setMobileOpen(true)} aria-label="Open sidebar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="header-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search projects, patents, paper IDs..." />
        </div>
      </div>

      <div className="header-right">
        <div className="notification-wrapper">
          <button
            className="notification-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="notification-dot"></span>
          </button>

          {notificationsOpen && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                <span className="badge">2 New</span>
              </div>
              <div className="dropdown-list">
                {notifications.map((n) => (
                  <div key={n.id} className={`dropdown-item ${n.unread ? 'unread' : ''}`}>
                    <p className="item-text">{n.text}</p>
                    <span className="item-time">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="user-profile">
          <div className="avatar">
            {activeUser?.photoURL ? (
              <img src={activeUser.photoURL} alt={displayName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <span className="user-role" title={email}>{email}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
