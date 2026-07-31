import './MetricCard.css'

function MetricCard({ title, value, change, trend, icon, color }) {
  return (
    <div className="metric-card card">
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        <div className={`metric-icon-bg ${color}`}>
          {icon}
        </div>
      </div>
      <div className="metric-content">
        <div className="metric-value">{value}</div>
        <div className={`metric-change ${trend}`}>
          {trend === 'up' ? '↑' : '↓'} {change}
          <span className="metric-period"> vs last month</span>
        </div>
      </div>
    </div>
  )
}

export default MetricCard
