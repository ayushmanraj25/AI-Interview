import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import Navbar from '../components/Navbar/Navbar'
import { authService } from '../services/authService'
import './Dashboard.css'

// Register Chart.js components for Line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [pastSessions, setPastSessions] = useState([
    { id: 'session-101', role: 'React Frontend Developer', date: '2026-06-08', score: 86 },
    { id: 'session-102', role: 'Full Stack Engineer', date: '2026-06-05', score: 79 },
    { id: 'session-103', role: 'FastAPI Backend Developer', date: '2026-06-01', score: 84 },
  ])

  useEffect(() => {
    setUser(authService.getCurrentUser())
  }, [])

  // Sort sessions chronologically (oldest to newest) for line progression
  const sortedSessions = [...pastSessions].sort((a, b) => new Date(a.date) - new Date(b.date))

  const chartData = {
    labels: sortedSessions.map(s => {
      // Format date nicely e.g. "Jun 1"
      const dateObj = new Date(s.date)
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
    }),
    datasets: [
      {
        label: 'Overall Score',
        data: sortedSessions.map(s => s.score),
        fill: true,
        borderColor: '#10b981', // Sage Green
        backgroundColor: 'rgba(16, 185, 129, 0.04)', // Minimal transparent green fill
        tension: 0.3, // Soft curve
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#121318',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#121318',
        pointHoverBorderColor: '#10b981',
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.4)',
          font: {
            family: 'Inter, system-ui, -apple-system, sans-serif',
            size: 10
          },
          stepSize: 10
        },
        min: 50,
        max: 100
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.4)',
          font: {
            family: 'Inter, system-ui, -apple-system, sans-serif',
            size: 10
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1c1d24',
        titleColor: '#fff',
        bodyColor: '#10b981',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex
            return sortedSessions[index].role
          },
          label: (context) => ` Score: ${context.raw}%`
        }
      }
    }
  }

  return (
    <div className="dashboard-page">

      <Navbar />
      
      <div className="container py-12 flex flex-col gap-8">
        
        {/* Welcome Section */}
        <div className="welcome-banner glass-card flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Hello, {localStorage.getItem('user_display_name') || user?.email || 'Candidate'}!</h2>
            <p className="text-gray-400 text-sm mt-1">Welcome back to your AI Interview coach dashboard. Track your growth progress.</p>
          </div>
          <Link to="/resume" className="btn btn-primary">Start New Mock Session</Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-3 gap-6">
          <div className="stat-card glass-card flex flex-col items-center">
            <span className="stat-val gradient-text font-extrabold text-3xl">3</span>
            <span className="stat-label mt-2 text-xs text-gray-400 text-uppercase font-semibold">Total Sessions</span>
          </div>
          <div className="stat-card glass-card flex flex-col items-center">
            <span className="stat-val text-cyan font-extrabold text-3xl" style={{ color: '#22d3ee' }}>83%</span>
            <span className="stat-label mt-2 text-xs text-gray-400 text-uppercase font-semibold">Average Score</span>
          </div>
          <div className="stat-card glass-card flex flex-col items-center">
            <span className="stat-val text-green font-extrabold text-3xl" style={{ color: '#10b981' }}>100%</span>
            <span className="stat-label mt-2 text-xs text-gray-400 text-uppercase font-semibold">Completeness</span>
          </div>
        </div>

        {/* Score Progression Analytics Panel */}
        <div className="analytics-panel glass-card">
          <h3 className="text-lg font-bold">Score Progression Analytics</h3>
          <p className="text-gray-400 text-sm mt-1 mb-6">Historical record of performance grades across evaluation sessions.</p>
          <div className="chart-container" style={{ height: '240px', width: '100%', position: 'relative' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* History Logs */}
        <div className="logs-panel glass-card">
          <h3 className="text-lg font-bold mb-4">Past Assessment Logs</h3>
          <div className="logs-table-container">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Target Job Role</th>
                  <th>Assessment Date</th>
                  <th>Overall Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pastSessions.map((session) => (
                  <tr key={session.id}>
                    <td className="font-semibold text-gray-200">{session.role}</td>
                    <td className="text-gray-400 text-sm">{session.date}</td>
                    <td>
                      <span className={`score-badge ${session.score >= 80 ? 'high' : 'medium'}`}>
                        {session.score}%
                      </span>
                    </td>
                    <td>
                      <Link to={`/results?session_id=${session.id}`} className="btn btn-secondary py-1 px-3 text-xs">
                        View Report
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
