import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Sidebar from '../components/Dashboard/Sidebar'
import Header from '../components/Dashboard/Header'
import apiService from '../services/api'
import '../styles/History.css'

const fallbackHistoryData = [
  {
    id: 'PRJ-8042',
    name: 'AI-Driven Code Reviewer',
    category: 'Artificial Intelligence',
    score: 94,
    patents: 0,
    papers: 14,
    githubRepos: 8,
    date: 'Jul 30, 2026',
    status: 'Verified',
    description: 'Automated static analysis and code security scanning tool using zero-shot LLMs.',
  },
  {
    id: 'PRJ-8041',
    name: 'Decentralized Micro-Loans',
    category: 'Fintech & Blockchain',
    score: 82,
    patents: 2,
    papers: 5,
    githubRepos: 19,
    date: 'Jul 28, 2026',
    status: 'Flagged',
    description: 'Peer-to-peer micro-lending protocol utilizing smart contracts and zk-proofs.',
  },
  {
    id: 'PRJ-8040',
    name: 'Smart ECG Monitor App',
    category: 'Healthtech',
    score: 89,
    patents: 1,
    papers: 23,
    githubRepos: 3,
    date: 'Jul 25, 2026',
    status: 'Verified',
    description: 'Wearable ECG monitoring software with predictive arrhythmia alerts.',
  },
]

function History() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('History')

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReport, setSelectedReport] = useState(null)
  const [toastMessage, setToastMessage] = useState('')
  const [downloadingId, setDownloadingId] = useState('')
  const itemsPerPage = 5

  const historyQuery = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      try {
        const res = await apiService.getHistory()
        if (Array.isArray(res) && res.length > 0) {
          return res.map((item) => ({
            id: item.id || `PRJ-${item.projectId?.slice(0, 4)}`,
            name: item.project?.title || item.title || 'Untitled Project',
            category: item.project?.domain || 'Software Technology',
            score: item.report?.overallScore || 85,
            patents: 1,
            papers: 5,
            githubRepos: 3,
            date: new Date(item.createdAt || Date.now()).toLocaleDateString(),
            status: item.report?.overallScore >= 75 ? 'Verified' : 'Flagged',
            description: item.project?.description || 'Automated Innovation Validation Report.',
          }))
        }
      } catch (_e) {
        // Fallback demo data
      }
      return fallbackHistoryData
    },
  })

  const historyList = historyQuery.data || fallbackHistoryData

  const handlePdfDownload = async (id) => {
    setDownloadingId(`${id}-pdf`)
    try {
      await apiService.downloadPdf(id)
    } catch (err) {
      setToastMessage(`PDF Download Notice: ${err.message}`)
    } finally {
      setDownloadingId('')
    }
  }

  const handlePptDownload = async (id) => {
    setDownloadingId(`${id}-ppt`)
    try {
      await apiService.downloadPpt(id)
    } catch (err) {
      setToastMessage(`PPT Download Notice: ${err.message}`)
    } finally {
      setDownloadingId('')
    }
  }

  const filteredData = historyList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="history-layout">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="history-main">
        <Header setMobileOpen={setMobileOpen} />

        <main className="history-content">
          <div className="history-page-header">
            <div>
              <h1 className="history-page-title">Idea Analysis History</h1>
              <p className="history-page-subtitle">
                Review, filter, inspect, and export your past innovation reports.
              </p>
            </div>

            <Link to="/analyze" className="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Analysis
            </Link>
          </div>

          {toastMessage && (
            <div className="auth-alert success" style={{ marginBottom: '20px' }}>
              <span>{toastMessage}</span>
            </div>
          )}

          <div className="history-card">
            <div className="history-controls-bar">
              <div className="search-box-wrapper">
                <input
                  type="text"
                  className="search-box-input"
                  placeholder="Search by project name or ID..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>

              <div className="filters-wrapper">
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Verified">Verified</option>
                  <option value="Flagged">Flagged</option>
                </select>
              </div>
            </div>

            {historyQuery.isLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                <div className="spinner" style={{ margin: '0 auto 12px' }}></div>
                Loading Analysis History from PostgreSQL...
              </div>
            ) : (
              <div className="history-table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Category</th>
                      <th>Score</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((row) => (
                        <tr key={row.id}>
                          <td>
                            <div className="project-name-cell">
                              <span className="project-name">{row.name}</span>
                              <span className="project-id">{row.id}</span>
                            </div>
                          </td>
                          <td>
                            <span className="category-pill">{row.category}</span>
                          </td>
                          <td>
                            <span className={`score-value ${row.score >= 85 ? 'high' : row.score >= 75 ? 'medium' : 'low'}`}>
                              {row.score}/100
                            </span>
                          </td>
                          <td>{row.date}</td>
                          <td>
                            <span className={`status-badge ${row.status.toLowerCase()}`}>
                              {row.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                              <button
                                className="action-btn"
                                title="View Report Modal"
                                onClick={() => setSelectedReport(row)}
                              >
                                👁️ View
                              </button>
                              <button
                                className="action-btn"
                                onClick={() => handlePdfDownload(row.id)}
                                disabled={downloadingId === `${row.id}-pdf`}
                                style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                              >
                                {downloadingId === `${row.id}-pdf` ? '⏳...' : '📄 PDF'}
                              </button>
                              <button
                                className="action-btn"
                                onClick={() => handlePptDownload(row.id)}
                                disabled={downloadingId === `${row.id}-ppt`}
                                style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                              >
                                {downloadingId === `${row.id}-ppt` ? '⏳...' : '📊 PPT'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                          No project history matches your filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* View Report Modal */}
          {selectedReport && (
            <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
              <div className="report-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div>
                    <span className="project-id">{selectedReport.id}</span>
                    <h2 className="history-page-title" style={{ fontSize: '1.5rem', marginTop: '4px' }}>
                      {selectedReport.name}
                    </h2>
                  </div>
                  <button className="close-modal-btn" onClick={() => setSelectedReport(null)}>✕</button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>
                    Domain: <strong style={{ color: '#1F2937' }}>{selectedReport.category}</strong>
                  </div>
                  <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: '1.6' }}>
                    {selectedReport.description}
                  </p>
                </div>

                <div className="results-grid" style={{ marginBottom: '24px' }}>
                  <div className="result-stat-box">
                    <div className="stat-title">Innovation Score</div>
                    <div className="stat-value" style={{ color: '#4F46E5' }}>{selectedReport.score}/100</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handlePdfDownload(selectedReport.id)}
                    disabled={downloadingId === `${selectedReport.id}-pdf`}
                    className="btn btn-outline"
                  >
                    {downloadingId === `${selectedReport.id}-pdf` ? '⏳ Generating PDF...' : '📥 PDF Report'}
                  </button>
                  <button
                    onClick={() => handlePptDownload(selectedReport.id)}
                    disabled={downloadingId === `${selectedReport.id}-ppt`}
                    className="btn btn-primary"
                  >
                    {downloadingId === `${selectedReport.id}-ppt` ? '⏳ Generating Deck...' : '📊 Pitch Deck (.pptx)'}
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

export default History
