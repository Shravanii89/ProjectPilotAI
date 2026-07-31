import './Features.css'

const features = [
  {
    icon: '🧬',
    title: 'Innovation DNA Score',
    description: 'Get a comprehensive originality score by analyzing your idea against millions of existing projects, papers, and patents.',
    badge: 'AI Powered',
  },
  {
    icon: '📋',
    title: 'Patent Search',
    description: 'Automatically search through global patent databases to ensure your idea doesn\'t infringe on existing intellectual property.',
    badge: 'Global Database',
  },
  {
    icon: '📄',
    title: 'Research Paper Search',
    description: 'Scan academic repositories including arXiv, PubMed, and IEEE to find related research and prior art.',
    badge: '100M+ Papers',
  },
  {
    icon: '💻',
    title: 'GitHub Similarity',
    description: 'Compare your concept against millions of open-source repositories to understand the existing landscape.',
    badge: 'Real-time',
  },
  {
    icon: '🤖',
    title: 'AI Recommendations',
    description: 'Receive intelligent suggestions to differentiate your idea, identify gaps in the market, and strengthen your value proposition.',
    badge: 'Smart Insights',
  },
  {
    icon: '📊',
    title: 'Competition Ready Reports',
    description: 'Generate polished, professional reports perfect for hackathons, pitch decks, and investor presentations.',
    badge: 'Export Ready',
  },
]

function Features() {
  return (
    <section className="features section" id="features">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Powerful Features for <span className="gradient-text">Innovation</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to validate, analyze, and refine your ideas
            before investing time and resources.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card card" key={index}>
              <div className="feature-icon-wrapper">
                <span className="feature-icon">{feature.icon}</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <span className="feature-badge">{feature.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
