import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../../services/authService'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  
  // Settings Drawer state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [aiModel, setAiModel] = useState(localStorage.getItem('ai_model') || 'gemini-flash')
  const [interviewMode, setInterviewMode] = useState(localStorage.getItem('interview_mode') || 'audio_video')
  const [showOverlay, setShowOverlay] = useState(localStorage.getItem('show_overlay') !== 'false')

  useEffect(() => {
    setUser(authService.getCurrentUser())
  }, [location.pathname])

  const handleLogout = async () => {
    await authService.logout()
    setUser(null)
    navigate('/login')
  }

  // Update setting handlers
  const handleModelChange = (model) => {
    setAiModel(model)
    localStorage.setItem('ai_model', model)
  }

  const handleModeChange = (mode) => {
    setInterviewMode(mode)
    localStorage.setItem('interview_mode', mode)
  }

  const handleOverlayToggle = () => {
    const nextVal = !showOverlay
    setShowOverlay(nextVal)
    localStorage.setItem('show_overlay', nextVal.toString())
  }

  return (
    <>
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
            
            {/* Settings Tab Button */}
            <button 
              onClick={() => setIsSettingsOpen(true)} 
              className="settings-btn flex items-center justify-center"
              title="Open Settings"
            >
              ⚙️
            </button>
          </div>
        </div>
      </nav>

      {/* Settings Side Drawer */}
      <div className={`settings-drawer-overlay ${isSettingsOpen ? 'visible' : ''}`} onClick={() => setIsSettingsOpen(false)}></div>
      <div className={`settings-drawer ${isSettingsOpen ? 'open' : ''}`}>
        <div className="drawer-header flex justify-between items-center pb-4 mb-6">
          <h3 className="text-xl font-bold">Preferences</h3>
          <button onClick={() => setIsSettingsOpen(false)} className="drawer-close-btn">✕</button>
        </div>

        <div className="drawer-body flex flex-col gap-6">
          
          {/* AI Model Preference */}
          <div className="setting-section">
            <label className="setting-label">AI Recruiter Model</label>
            <div className="setting-options mt-2 flex flex-col gap-2">
              <label className="option-row flex items-center gap-2">
                <input 
                  type="radio" 
                  name="ai_model" 
                  checked={aiModel === 'gemini-flash'} 
                  onChange={() => handleModelChange('gemini-flash')}
                />
                <span>Gemini 1.5 Flash (Fast)</span>
              </label>
              <label className="option-row flex items-center gap-2">
                <input 
                  type="radio" 
                  name="ai_model" 
                  checked={aiModel === 'gemini-pro'} 
                  onChange={() => handleModelChange('gemini-pro')}
                />
                <span>Gemini 1.5 Pro (Analytical)</span>
              </label>
            </div>
          </div>

          {/* Assessment Mode */}
          <div className="setting-section">
            <label className="setting-label">Interview Mode</label>
            <div className="setting-options mt-2 flex flex-col gap-2">
              <label className="option-row flex items-center gap-2">
                <input 
                  type="radio" 
                  name="interview_mode" 
                  checked={interviewMode === 'audio_only'} 
                  onChange={() => handleModeChange('audio_only')}
                />
                <span>Audio Response Only</span>
              </label>
              <label className="option-row flex items-center gap-2">
                <input 
                  type="radio" 
                  name="interview_mode" 
                  checked={interviewMode === 'audio_video'} 
                  onChange={() => handleModeChange('audio_video')}
                />
                <span>Audio + Webcam Feedback</span>
              </label>
            </div>
          </div>

          {/* Visual Guides */}
          <div className="setting-section">
            <label className="setting-label font-semibold">HUD Tracking Guides</label>
            <label className="option-row mt-2 flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={showOverlay} 
                onChange={handleOverlayToggle}
              />
              <span>Show eye contact & posture indicators</span>
            </label>
          </div>

        </div>
      </div>
    </>
  )
}
