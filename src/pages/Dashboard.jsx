import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Dashboard/Sidebar'
import Header from '../components/Dashboard/Header'
import MetricCard from '../components/Dashboard/MetricCard'
import { ScoreTrendChart, CategoryDistributionChart } from '../components/Dashboard/Charts'
import RecentTable from '../components/Dashboard/RecentTable'
import './Dashboard.css'

function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Dashboard')
  const { currentUser } = useAuth()

  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Innovator'

  const metrics = [
    {
      title: 'Projects Analyzed',
      value: '128',
      change: '14%',
      trend: 'up',
      color: 'primary',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
    {
      title: 'Average Innovation Score',
      value: '88.4',
      change: '5.2%',
      trend: 'up',
      color: 'secondary',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
    },
    {
      title: 'Patents Searched',
      value: '42',
      change: '3.1%',
      trend: 'down',
      color: 'accent',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      ),
    },
    {
      title: 'Research Papers Found',
      value: '1,240',
      change: '22%',
      trend: 'up',
      color: 'success',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="dashboard-layout">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="dashboard-main">
        <Header setMobileOpen={setMobileOpen} />

        <main className="dashboard-content">
          <div className="welcome-banner">
            <div>
              <h1 className="welcome-title">Welcome back, {userName} 👋</h1>
              <p className="welcome-subtitle">
                Here's a breakdown of your idea validation metrics and originality reports.
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

          <div className="metrics-grid">
            {metrics.map((m, idx) => (
              <MetricCard key={idx} {...m} />
            ))}
          </div>

          <div className="charts-grid">
            <ScoreTrendChart />
            <CategoryDistributionChart />
          </div>

          <RecentTable />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
