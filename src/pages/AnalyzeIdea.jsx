import { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Sidebar from '../components/Dashboard/Sidebar'
import Header from '../components/Dashboard/Header'
import apiService from '../services/api'
import '../styles/AnalyzeIdea.css'

const ANALYSIS_STAGES = [
  '💻 Scanning 200M+ GitHub Repositories...',
  '📄 Searching Semantic Scholar Academic Papers...',
  '📜 Querying USPTO & PatentsView Patent Grants...',
  '🚀 Searching Commercial Startups & Hackathon Databases...',
  '🤖 Computing 384-dimensional Vector Cosine Similarity...',
  '🧬 Calculating Innovation DNA Metric Breakdown...',
  '🧠 Running Google Gemini 2.5 Flash Synthesis...',
  '📑 Compiling Final Report & Pitch Deck Documents...',
]

function AnalyzeIdea() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Analyze Idea')
  const queryClient = useQueryClient()

  // Form State
  const [title, setTitle] = useState('')
  const [domain, setDomain] = useState('Artificial Intelligence & ML')
  const [competition, setCompetition] = useState('medium')
  const [description, setDescription] = useState('')

  // Upload State
  const [file, setFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  // Progress & Download State
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [activeResultTab, setActiveResultTab] = useState('dna')
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [downloadingPpt, setDownloadingPpt] = useState(false)

  const domains = [
    'Artificial Intelligence & ML',
    'SaaS & Web Applications',
    'Fintech & Blockchain',
    'Healthtech & Biotech',
    'Edtech & Learning',
    'E-Commerce & Retail',
    'Clean Energy & Sustainability',
    'Robotics & Hardware',
    'Cybersecurity AI',
    'Other',
  ]

  // React Query Mutation
  const analyzeMutation = useMutation({
    mutationFn: (payload) => apiService.generateFullReport(payload),
    onSuccess: (data) => {
      setResults(data)
      queryClient.invalidateQueries(['history'])
      setCurrentStageIndex(ANALYSIS_STAGES.length - 1)
    },
    onError: (err) => {
      setError(err.message || 'Analysis failed. Please try again.')
    },
  })

  useEffect(() => {
    let interval = null
    if (analyzeMutation.isPending) {
      setCurrentStageIndex(0)
      interval = setInterval(() => {
        setCurrentStageIndex((prev) => (prev < ANALYSIS_STAGES.length - 2 ? prev + 1 : prev))
      }, 700)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [analyzeMutation.isPending])

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return
    const ext = selectedFile.name.split('.').pop().toLowerCase()
    if (!['pdf', 'docx', 'txt'].includes(ext)) {
      setError('Unsupported file type. Please upload a PDF, DOCX, or TXT file.')
      return
    }
    setError('')
    setFile(selectedFile)
    setUploadProgress(0)

    let progress = 0
    const interval = setInterval(() => {
      progress += 25
      setUploadProgress(progress)
      if (progress >= 100) clearInterval(interval)
    }, 150)
  }

  const handleClear = () => {
    setTitle('')
    setDomain('Artificial Intelligence & ML')
    setCompetition('medium')
    setDescription('')
    setFile(null)
    setUploadProgress(0)
    setResults(null)
    setError('')
  }

  const handleAnalyze = (e) => {
    e.preventDefault()
    if (!title.trim() && !description.trim() && !file) {
      setError('Please provide a project title or description to analyze.')
      return
    }

    setError('')
    setResults(null)

    analyzeMutation.mutate({
      title: title.trim() || 'Untitled Innovation Project',
      description: description.trim() || title.trim(),
      domain: domain || 'General Software',
      competition: competition || 'medium',
    })
  }

  const handleDownloadPdf = async () => {
    if (!results?.reportId) return
    setDownloadingPdf(true)
    try {
      await apiService.downloadPdf(results.reportId)
    } catch (err) {
      setError(`PDF download error: ${err.message}`)
    } finally {
      setDownloadingPdf(false)
    }
  }

  const handleDownloadPpt = async () => {
    if (!results?.reportId) return
    setDownloadingPpt(true)
    try {
      await apiService.downloadPpt(results.reportId)
    } catch (err) {
      setError(`Pitch Deck download error: ${err.message}`)
    } finally {
      setDownloadingPpt(false)
    }
  }

  return (
    <div className="analyze-layout">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="analyze-main">
        <Header setMobileOpen={setMobileOpen} />

        <main className="analyze-content">
          <div className="analyze-page-header">
            <h1 className="analyze-page-title">Analyze Your Innovation</h1>
            <p className="analyze-page-subtitle">
              Validate your raw project idea against global patents, research papers, GitHub, startups, and vector similarity engines.
            </p>
          </div>

          {error && (
            <div className="auth-alert error" style={{ marginBottom: '24px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="analyze-card">
            <form onSubmit={handleAnalyze}>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Autonomous AI Health Diagnostic System"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Domain Category</label>
                  <select
                    className="form-select"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  >
                    {domains.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Competition Intensity</label>
                  <select
                    className="form-select"
                    value={competition}
                    onChange={(e) => setCompetition(e.target.value)}
                  >
                    <option value="low">Low Competition Landscape</option>
                    <option value="medium">Medium Competition Landscape</option>
                    <option value="high">High Competition Landscape</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Idea Description & Technical Summary</label>
                <textarea
                  className="idea-textarea"
                  placeholder="Describe your core concept, technical approach, key features, target problem, and unique value proposition..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="textarea-footer">
                  <span>Be as detailed as possible for higher precision analysis</span>
                  <span>{description.length} characters</span>
                </div>
              </div>

              {/* Drag and Drop File Upload */}
              <div
                className={`dropzone ${isDragging ? 'dragging' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
                <div className="dropzone-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div className="dropzone-title">
                  Drag & drop proposal document here, or <span className="auth-link">browse files</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="analyze-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleClear}
                  disabled={analyzeMutation.isPending}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={analyzeMutation.isPending}
                >
                  {analyzeMutation.isPending ? (
                    <>
                      <div className="spinner"></div>
                      Analyzing Multi-Source Intelligence...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                      </svg>
                      Run Full AI Analysis
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Live Progress Stage Indicator */}
            {analyzeMutation.isPending && (
              <div style={{ marginTop: '24px', padding: '20px', background: '#EEF2FF', borderRadius: '12px', border: '1px solid #C7D2FE' }}>
                <div style={{ fontWeight: '600', color: '#4F46E5', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                  {ANALYSIS_STAGES[currentStageIndex]}
                </div>
                <div style={{ height: '6px', background: '#E0E7FF', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${((currentStageIndex + 1) / ANALYSIS_STAGES.length) * 100}%`,
                      background: 'linear-gradient(90deg, #4F46E5, #6D28D9)',
                      transition: 'width 0.4s ease',
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Full Analysis Results Display */}
          {results && (
            <div className="results-card" style={{ marginTop: '32px' }}>
              <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 className="analyze-page-title" style={{ fontSize: '1.6rem' }}>
                    {results.title}
                  </h2>
                  <p className="analyze-page-subtitle">
                    Domain: <strong>{results.domain}</strong> | Generated At: {new Date(results.generatedAt).toLocaleTimeString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleDownloadPdf}
                    disabled={downloadingPdf}
                    className="btn btn-outline"
                    style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                  >
                    {downloadingPdf ? '⏳ Generating PDF...' : '📥 Download PDF Report'}
                  </button>
                  <button
                    onClick={handleDownloadPpt}
                    disabled={downloadingPpt}
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                  >
                    {downloadingPpt ? '⏳ Generating Deck...' : '📊 Download Pitch Deck (.pptx)'}
                  </button>
                </div>
              </div>

              {/* Result Navigation Tabs */}
              <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #E5E7EB', margin: '24px 0 16px 0', overflowX: 'auto' }}>
                {[
                  { id: 'dna', label: '🧬 Innovation DNA' },
                  { id: 'summary', label: '📌 Executive Summary' },
                  { id: 'competitors', label: '🚀 Competitors & Repos' },
                  { id: 'tech', label: '💻 Tech Stack & Roadmap' },
                  { id: 'markdown', label: '📝 Markdown Report' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveResultTab(tab.id)}
                    style={{
                      padding: '10px 16px',
                      border: 'none',
                      background: 'none',
                      fontWeight: activeResultTab === tab.id ? '700' : '500',
                      color: activeResultTab === tab.id ? '#4F46E5' : '#6B7280',
                      borderBottom: activeResultTab === tab.id ? '2px solid #4F46E5' : '2px solid transparent',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Innovation DNA */}
              {activeResultTab === 'dna' && (
                <div>
                  <div style={{ background: '#F8F6F1', padding: '24px', borderRadius: '16px', marginBottom: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: '800', color: '#4F46E5' }}>
                      {results.sections?.innovationDna?.overallScore || 75}/100
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1F2937' }}>
                      {results.sections?.innovationDna?.ratingGrade}
                    </div>
                  </div>

                  <div className="results-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {Object.entries(results.sections?.innovationDna?.scores || {}).map(([key, val]) => (
                      <div key={key} className="result-stat-box">
                        <div className="stat-title" style={{ textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </div>
                        <div className="stat-value" style={{ color: val >= 75 ? '#16A34A' : '#F59E0B' }}>
                          {val}/100
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Executive Summary */}
              {activeResultTab === 'summary' && (
                <div style={{ lineHeight: '1.7', color: '#374151' }}>
                  <h3 style={{ marginBottom: '12px', color: '#1F2937' }}>Executive Summary</h3>
                  <p style={{ background: '#F9FAFB', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #4F46E5' }}>
                    {results.sections?.executiveSummary}
                  </p>
                  <h3 style={{ margin: '24px 0 12px 0', color: '#1F2937' }}>Patent & Research Opportunities</h3>
                  <p><strong>Patentability:</strong> {results.sections?.patentOpportunities}</p>
                  <p style={{ marginTop: '8px' }}><strong>Business Scope:</strong> {results.sections?.businessOpportunities}</p>
                </div>
              )}

              {/* Tab 3: Competitors & Repos */}
              {activeResultTab === 'competitors' && (
                <div>
                  <h3 style={{ marginBottom: '16px' }}>Top Market Competitors & Startups</h3>
                  <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
                    {(results.sections?.competitionAnalysis?.marketCompetitors || []).map((comp, idx) => (
                      <div key={idx} style={{ padding: '16px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
                        <div style={{ fontWeight: '700', color: '#4F46E5' }}>{comp.name}</div>
                        <div style={{ fontSize: '0.9rem', color: '#4B5563', margin: '4px 0' }}>{comp.description}</div>
                        <a href={comp.website} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: '#6D28D9', textDecoration: 'underline' }}>
                          {comp.website}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Tech Stack & Roadmap */}
              {activeResultTab === 'tech' && (
                <div>
                  <h3 style={{ marginBottom: '16px' }}>Recommended Technology Stack</h3>
                  <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                    <p><strong>Frontend:</strong> {results.sections?.technologyStack?.frontend}</p>
                    <p style={{ marginTop: '8px' }}><strong>Backend:</strong> {results.sections?.technologyStack?.backend}</p>
                    <p style={{ marginTop: '8px' }}><strong>Database:</strong> {results.sections?.technologyStack?.database}</p>
                    <p style={{ marginTop: '8px' }}><strong>AI/ML Engine:</strong> {results.sections?.technologyStack?.ai_ml}</p>
                  </div>
                </div>
              )}

              {/* Tab 5: Markdown Report */}
              {activeResultTab === 'markdown' && (
                <div>
                  <pre style={{ background: '#1F2937', color: '#F9FAFB', padding: '24px', borderRadius: '12px', overflowX: 'auto', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    {results.markdownReport}
                  </pre>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AnalyzeIdea
