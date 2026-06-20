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
  
  // Scroll sizing states
  const [isScrolled, setIsScrolled] = useState(false)

  // Notification / User menu states
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  
  const [notifications, setNotifications] = useState([
    { id: 1, text: "AI Coach completed evaluation for session-101.", time: "2 hrs ago", read: false },
    { id: 2, text: "Resume profiling completed successfully.", time: "1 day ago", read: true },
    { id: 3, text: "Welcome to AI-Interview preparation center!", time: "3 days ago", read: true }
  ])

  const userDisplayName = localStorage.getItem('user_display_name') || 'Candidate'

  useEffect(() => {
    setUser(authService.getCurrentUser())
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setAiModel(localStorage.getItem('ai_model') || 'gemini-flash')
      setInterviewMode(localStorage.getItem('interview_mode') || 'audio_video')
      setShowOverlay(localStorage.getItem('show_overlay') !== 'false')
      setTheme(localStorage.getItem('theme') || 'light')
    }
    window.addEventListener('settings-updated', handleSettingsUpdate)
    return () => window.removeEventListener('settings-updated', handleSettingsUpdate)
  }, [])

  const handleLogout = async () => {
    setIsUserDropdownOpen(false)
    await authService.logout()
    setUser(null)
    navigate('/login')
  }

  // Update setting handlers
  const handleModelChange = (model) => {
    setAiModel(model)
    localStorage.setItem('ai_model', model)
    window.dispatchEvent(new Event('settings-updated'))
  }

  const handleModeChange = (mode) => {
    setInterviewMode(mode)
    localStorage.setItem('interview_mode', mode)
    window.dispatchEvent(new Event('settings-updated'))
  }

  const handleOverlayToggle = () => {
    const nextVal = !showOverlay
    setShowOverlay(nextVal)
    localStorage.setItem('show_overlay', nextVal.toString())
    window.dispatchEvent(new Event('settings-updated'))
  }

  const handleThemeToggle = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    window.dispatchEvent(new Event('settings-updated'))
  }

  return (
    <>
      <nav className={`navbar glass-card ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container flex items-center justify-between">
          <Link to="/" className="navbar-logo flex items-center gap-2">
            <span className="logo-icon">🤖</span>
            <span className="gradient-text font-bold text-xl">AI-Interview</span>
          </Link>
          
          <div className="navbar-links flex items-center gap-6">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
                <Link to="/resume" className={`nav-link ${location.pathname === '/resume' ? 'active' : ''}`}>Resume Analyze</Link>

                {/* Notifications Bell */}
                <div className="notifications-menu-container" style={{ position: 'relative' }}>
                  <button 
                    onClick={() => {
                      setIsNotificationsOpen(!isNotificationsOpen)
                      setIsUserDropdownOpen(false)
                    }}
                    className={`bell-btn flex items-center justify-center ${notifications.some(n => !n.read) ? 'unread animate-wiggle' : ''}`}
                    title="Notifications"
                  >
                    🔔
                  </button>
                  {isNotificationsOpen && (
                    <div className="notifications-dropdown glass-card animate-fade-in">
                      <div className="dropdown-header border-b border-gray-800 pb-2 mb-2 flex justify-between items-center">
                        <span className="font-bold text-xs text-gray-400 uppercase">Coach Feedbacks</span>
                        <button 
                          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                          className="mark-read-btn text-xs text-brand-primary"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="dropdown-list flex flex-col gap-2">
                        {notifications.map(item => (
                          <div key={item.id} className={`notification-item ${item.read ? 'read' : 'unread'} flex flex-col`}>
                            <p className="notif-text text-xs text-gray-200">{item.text}</p>
                            <span className="notif-time text-xs text-gray-500 mt-1">{item.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Avatar Dropdown */}
                <div className="user-menu-container" style={{ position: 'relative' }}>
                  <button 
                    onClick={() => {
                      setIsUserDropdownOpen(!isUserDropdownOpen)
                      setIsNotificationsOpen(false)
                    }}
                    className="avatar-btn flex items-center justify-center font-bold"
                  >
                    {userDisplayName.charAt(0).toUpperCase()}
                  </button>
                  {isUserDropdownOpen && (
                    <div className="user-dropdown glass-card animate-fade-in">
                      <div className="dropdown-profile-header border-b border-gray-800 pb-3 mb-2 flex flex-col">
                        <span className="dropdown-name font-bold text-sm text-gray-200">{userDisplayName}</span>
                        <span className="dropdown-email text-xs text-gray-500 mt-0.5">{user?.email}</span>
                      </div>
                      <div className="dropdown-links flex flex-col gap-1">
                        <Link to="/dashboard" onClick={() => setIsUserDropdownOpen(false)} className="dropdown-link-item">
                          📊 Dashboard
                        </Link>
                        <Link to="/profile" onClick={() => setIsUserDropdownOpen(false)} className="dropdown-link-item">
                          ⚙️ Control Center
                        </Link>
                        <button onClick={handleLogout} className="dropdown-logout-btn mt-2 w-full text-left">
                          🚪 Logout Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
          
          {/* Theme Selector */}
          <div className="setting-section">
            <label className="setting-label">System Theme</label>
            <div className="option-row mt-2 flex items-center justify-between">
              <span>Dark Theme Mode</span>
              <div 
                className={`toggle-switch-mini ${theme === 'dark' ? 'active' : ''}`}
                onClick={handleThemeToggle}
              >
                <div className="switch-knob-mini"></div>
              </div>
            </div>
          </div>

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
