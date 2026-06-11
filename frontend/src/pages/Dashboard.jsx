import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import { authService } from '../services/authService'
import './Dashboard.css'

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

  return (
    <div className="dashboard-page">

      <Navbar />
      
      <div className="container py-12 flex flex-col gap-8">
        
        {/* Welcome Section */}
        <div className="welcome-banner glass-card flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Hello, {user?.email || 'Candidate'}!</h2>
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
            <span className="stat-val text-cyan font-extrabold text-3xl">83%</span>
            <span className="stat-label mt-2 text-xs text-gray-400 text-uppercase font-semibold">Average Score</span>
          </div>
          <div className="stat-card glass-card flex flex-col items-center">
            <span className="stat-val text-green font-extrabold text-3xl">100%</span>
            <span className="stat-label mt-2 text-xs text-gray-400 text-uppercase font-semibold">Completeness</span>
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
