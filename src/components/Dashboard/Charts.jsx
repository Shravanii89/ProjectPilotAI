import './Charts.css'

export function ScoreTrendChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  const scores = [72, 78, 85, 82, 88, 91, 94]

  return (
    <div className="chart-card card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Innovation Score Trend</h3>
          <p className="chart-subtitle">Average monthly originality evaluation</p>
        </div>
        <span className="chart-badge">+12% growth</span>
      </div>

      <div className="chart-body">
        <svg className="area-chart" viewBox="0 0 500 200">
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.35"/>
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0"/>
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="40" x2="500" y2="40" stroke="#E5E7EB" strokeDasharray="4" />
          <line x1="0" y1="90" x2="500" y2="90" stroke="#E5E7EB" strokeDasharray="4" />
          <line x1="0" y1="140" x2="500" y2="140" stroke="#E5E7EB" strokeDasharray="4" />

          {/* Filled Area */}
          <path
            d="M 30 140 Q 90 120, 150 90 T 270 100 T 390 60 T 470 40 L 470 180 L 30 180 Z"
            fill="url(#scoreGrad)"
          />

          {/* Smooth Curved Line */}
          <path
            d="M 30 140 Q 90 120, 150 90 T 270 100 T 390 60 T 470 40"
            fill="none"
            stroke="#4F46E5"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {[
            { x: 30, y: 140, val: 72 },
            { x: 105, y: 120, val: 78 },
            { x: 180, y: 90, val: 85 },
            { x: 255, y: 100, val: 82 },
            { x: 330, y: 75, val: 88 },
            { x: 405, y: 55, val: 91 },
            { x: 470, y: 40, val: 94 },
          ].map((pt, i) => (
            <g key={i} className="chart-point">
              <circle cx={pt.x} cy={pt.y} r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2.5" />
            </g>
          ))}
        </svg>

        <div className="chart-x-axis">
          {months.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CategoryDistributionChart() {
  const categories = [
    { name: 'Artificial Intelligence', percentage: 42, color: '#4F46E5' },
    { name: 'SaaS & Web App', percentage: 28, color: '#6D28D9' },
    { name: 'Fintech & Blockchain', percentage: 18, color: '#0EA5E9' },
    { name: 'Healthtech & Biotech', percentage: 12, color: '#16A34A' },
  ]

  return (
    <div className="chart-card card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Category Distribution</h3>
          <p className="chart-subtitle">Breakdown by domain focus</p>
        </div>
      </div>

      <div className="category-chart-body">
        {/* Custom Donut representation */}
        <div className="donut-wrapper">
          <svg width="140" height="140" viewBox="0 0 42 42" className="donut-svg">
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#E5E7EB" strokeWidth="4" />
            
            {/* AI segment */}
            <circle
              cx="21" cy="21" r="15.915"
              fill="transparent"
              stroke="#4F46E5"
              strokeWidth="4.5"
              strokeDasharray="42 58"
              strokeDashoffset="25"
            />
            {/* SaaS segment */}
            <circle
              cx="21" cy="21" r="15.915"
              fill="transparent"
              stroke="#6D28D9"
              strokeWidth="4.5"
              strokeDasharray="28 72"
              strokeDashoffset="83"
            />
            {/* Fintech segment */}
            <circle
              cx="21" cy="21" r="15.915"
              fill="transparent"
              stroke="#0EA5E9"
              strokeWidth="4.5"
              strokeDasharray="18 82"
              strokeDashoffset="55"
            />
            {/* Healthtech segment */}
            <circle
              cx="21" cy="21" r="15.915"
              fill="transparent"
              stroke="#16A34A"
              strokeWidth="4.5"
              strokeDasharray="12 88"
              strokeDashoffset="37"
            />
          </svg>
          <div className="donut-center">
            <span className="donut-total">128</span>
            <span className="donut-label">Total</span>
          </div>
        </div>

        <div className="category-legend">
          {categories.map((cat, index) => (
            <div key={index} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: cat.color }}></span>
              <span className="legend-name">{cat.name}</span>
              <span className="legend-val">{cat.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
