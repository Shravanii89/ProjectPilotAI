import { Link } from 'react-router-dom'
import './Hero.css'

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero-badge">
          ✨ AI-Powered Innovation Validation
        </div>

        <h1 className="hero-title">
          Transform Raw Ideas into<br />
          <span className="gradient-text">Innovation</span>
        </h1>

        <p className="hero-subtitle">
          Validate originality using GitHub, research papers, patents and AI
          before you start building.
        </p>

        <div className="hero-actions">
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            Get Started
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <a href="#features" className="btn btn-outline btn-lg">
            Learn More
          </a>
        </div>

        <div className="hero-metrics">
          <div className="hero-metric">
            <div className="hero-metric-value">50K+</div>
            <div className="hero-metric-label">Ideas Validated</div>
          </div>
          <div className="hero-metric">
            <div className="hero-metric-value">98%</div>
            <div className="hero-metric-label">Accuracy Rate</div>
          </div>
          <div className="hero-metric">
            <div className="hero-metric-value">10x</div>
            <div className="hero-metric-label">Faster Research</div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-float-card">
            <div className="hero-card-title">🧬 Innovation Score</div>
            <div className="hero-progress-bar">
              <div className="hero-progress-fill"></div>
            </div>
            <div className="hero-card-detail">94% Original</div>
          </div>
          <div className="hero-float-card">
            <div className="hero-card-title">📊 Patent Match</div>
            <div className="hero-card-detail hero-card-success">✓ No conflicts found</div>
          </div>
          <div className="hero-float-card">
            <div className="hero-card-title">🚀 Market Readiness</div>
            <div className="hero-card-detail hero-card-highlight">High potential</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
