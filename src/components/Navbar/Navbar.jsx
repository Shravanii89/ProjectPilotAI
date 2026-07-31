import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#4F46E5"/>
            <path d="M16 7L25 12.5V21.5L16 27L7 21.5V12.5L16 7Z" fill="white" fillOpacity="0.9"/>
            <path d="M16 7L25 12.5L16 18L7 12.5L16 7Z" fill="white"/>
            <circle cx="16" cy="16" r="2.5" fill="#4F46E5"/>
          </svg>
          <span>ProjectPilot</span>
          <span className="logo-badge">AI</span>
        </Link>

        <div className="navbar-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className="navbar-cta" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/login" className="btn btn-outline" style={{ border: 'none', padding: '10px 16px' }}>
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>

        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
        <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it Works</a>
        <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
        <Link to="/login" className="btn btn-outline" style={{ width: '100%', marginTop: '8px' }} onClick={() => setMenuOpen(false)}>
          Sign In
        </Link>
        <Link to="/register" className="btn btn-primary" style={{ width: '100%', marginTop: '4px' }} onClick={() => setMenuOpen(false)}>
          Get Started
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
