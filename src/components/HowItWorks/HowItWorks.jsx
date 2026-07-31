import './HowItWorks.css'

const steps = [
  {
    number: '01',
    icon: '💡',
    title: 'Describe Your Idea',
    description: 'Simply describe your project idea in plain language. Our AI understands context, domain, and technical nuance.',
  },
  {
    number: '02',
    icon: '⚡',
    title: 'AI Deep Analysis',
    description: 'ProjectPilot scans GitHub repos, research papers, patents, and market data in seconds using advanced AI models.',
  },
  {
    number: '03',
    icon: '🎯',
    title: 'Get Actionable Results',
    description: 'Receive your Innovation DNA Score, detailed reports, and strategic recommendations to refine your approach.',
  },
]

function HowItWorks() {
  return (
    <section className="how-it-works section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="section-subtitle">
            Three simple steps to validate your innovation and stand out from
            the crowd.
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div className="step-card" key={index}>
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
