import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../../services/authService'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)

  useEffect(() => {
    setUser(authService.getCurrentUser())
  }, [location.pathname])

  const handleLogout = async () => {
    await authService.logout()
    setUser(null)
    navigate('/login')
  }

  return (
    <nav className="navbar glass-card">
      <div className="container flex items-center justify-between">
        <Link to="/" className="navbar-logo flex items-center gap-2">
          <span className="logo-icon">🤖</span>
          <span className="gradient-text font-bold text-xl">AI-Interview</span>
        </Link>
        
        <div className="navbar-links flex items-center gap-6">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
              <Link to="/resume" className={`nav-link ${location.pathname === '/resume' ? 'active' : ''}`}>Resume Analyze</Link>
              <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>Profile</Link>
              <button onClick={handleLogout} className="btn btn-secondary py-1 px-3">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary py-1 px-4">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
