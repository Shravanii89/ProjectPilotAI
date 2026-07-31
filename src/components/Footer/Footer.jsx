import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="#4F46E5"/>
                  <path d="M16 7L25 12.5V21.5L16 27L7 21.5V12.5L16 7Z" fill="white" fillOpacity="0.9"/>
                  <path d="M16 7L25 12.5L16 18L7 12.5L16 7Z" fill="white"/>
                  <circle cx="16" cy="16" r="2.5" fill="#4F46E5"/>
                </svg>
                <span>ProjectPilot</span>
                <span className="logo-badge">AI</span>
              </Link>
              <p className="footer-tagline">
                Validating innovation, one idea at a time.
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#how-it-works">How it Works</a></li>
                  <li><a href="#faq">FAQ</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="#">About</a></li>
                  <li><a href="#">Privacy</a></li>
                  <li><a href="#">Terms</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Connect</h4>
                <ul>
                  <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                  <li><a href="mailto:hello@projectpilot.ai">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 ProjectPilot AI. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
