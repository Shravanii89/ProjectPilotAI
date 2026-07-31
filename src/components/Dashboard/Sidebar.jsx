import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'

const navItems = [
  {
    name: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    path: '/dashboard',
  },
  {
    name: 'Analyze Idea',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    ),
    path: '/analyze',
  },
  {
    name: 'History',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    path: '/history',
  },
  {
    name: 'System Health',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    path: '/system-health',
  },
  {
    name: 'Settings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    path: '/settings',
  },
]

function Sidebar({ mobileOpen, setMobileOpen, activeTab, setActiveTab }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async (e) => {
    e.preventDefault()
    await logout()
    navigate('/login')
  }

  return (
    <>
      <aside className={`dashboard-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#4F46E5"/>
              <path d="M16 7L25 12.5V21.5L16 27L7 21.5V12.5L16 7Z" fill="white" fillOpacity="0.9"/>
              <path d="M16 7L25 12.5L16 18L7 12.5L16 7Z" fill="white"/>
              <circle cx="16" cy="16" r="2.5" fill="#4F46E5"/>
            </svg>
            <span className="logo-text">ProjectPilot</span>
            <span className="logo-badge">AI</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-title">MAIN MENU</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (activeTab === item.name && item.path.startsWith('#'))
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  setMobileOpen(false)
                  if (item.path.startsWith('#')) {
                    e.preventDefault()
                    setActiveTab(item.name)
                  }
                }}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-label">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <a href="#logout" className="sidebar-logout" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}
    </>
  )
}

export default Sidebar
