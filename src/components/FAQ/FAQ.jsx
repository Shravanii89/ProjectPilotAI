import { useState } from 'react'
import './FAQ.css'

const faqs = [
  {
    question: 'What is ProjectPilot AI?',
    answer: 'ProjectPilot AI is an intelligent platform that helps innovators validate the originality of their ideas by analyzing GitHub repositories, research papers, patents, and market data using advanced AI algorithms.',
  },
  {
    question: 'How does the Innovation DNA Score work?',
    answer: 'Our proprietary algorithm analyzes your idea across multiple dimensions — technical uniqueness, market differentiation, research novelty, and patent landscape — to generate a comprehensive originality score from 0-100.',
  },
  {
    question: 'What databases does ProjectPilot search?',
    answer: 'We search across GitHub (200M+ repos), arXiv, PubMed, IEEE, Google Patents, USPTO, EPO, and various market research databases to provide comprehensive analysis.',
  },
  {
    question: 'Is my idea data kept confidential?',
    answer: 'Absolutely. All idea submissions are encrypted end-to-end, never shared with third parties, and you retain full intellectual property rights. We take data privacy extremely seriously.',
  },
  {
    question: 'Can I use the reports for competitions and pitches?',
    answer: 'Yes! Our Competition Ready Reports are specifically designed for hackathons, pitch decks, and investor presentations. Export in PDF or share via a secure link.',
  },
]

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null)

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section className="faq section" id="faq">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to know about ProjectPilot AI.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              key={index}
            >
              <button className="faq-question" onClick={() => toggle(index)}>
                <span>{faq.question}</span>
                <svg
                  className="faq-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10 4V16M4 10H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
