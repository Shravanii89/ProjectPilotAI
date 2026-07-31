import './RecentTable.css'

const recentData = [
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
  },
  {
    id: 'PRJ-8039',
    name: 'Automated CRM Pipeline',
    category: 'SaaS & Web App',
    score: 68,
    patents: 4,
    papers: 2,
    githubRepos: 45,
    date: 'Jul 21, 2026',
    status: 'High Conflict',
  },
  {
    id: 'PRJ-8038',
    name: 'Autonomous Drone Delivery',
    category: 'Robotics',
    score: 91,
    patents: 1,
    papers: 18,
    githubRepos: 6,
    date: 'Jul 18, 2026',
    status: 'Verified',
  },
]

function RecentTable() {
  return (
    <div className="recent-table-card card">
      <div className="table-header">
        <div>
          <h3 className="table-title">Recent Idea Analyses</h3>
          <p className="table-subtitle">Overview of your latest project evaluations</p>
        </div>
        <button className="btn btn-outline btn-sm">View All</button>
      </div>

      <div className="table-responsive">
        <table className="recent-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Category</th>
              <th>Innovation Score</th>
              <th>Patents</th>
              <th>Papers</th>
              <th>GitHub Repos</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentData.map((row) => (
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
                  <div className="score-cell">
                    <span className={`score-value ${row.score >= 85 ? 'high' : row.score >= 75 ? 'medium' : 'low'}`}>
                      {row.score}/100
                    </span>
                  </div>
                </td>
                <td>{row.patents}</td>
                <td>{row.papers}</td>
                <td>{row.githubRepos}</td>
                <td>{row.date}</td>
                <td>
                  <span className={`status-badge ${row.status.toLowerCase().replace(' ', '-')}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentTable
