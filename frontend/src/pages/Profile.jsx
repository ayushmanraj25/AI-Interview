import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar/Navbar'
import { authService } from '../services/authService'
import './Profile.css'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('account')
  const [displayName, setDisplayName] = useState(localStorage.getItem('user_display_name') || 'John Doe')
  const [jobPreference, setJobPreference] = useState(localStorage.getItem('user_job_preference') || 'Frontend Developer')
  const [aiModel, setAiModel] = useState(localStorage.getItem('ai_model') || 'gemini-flash')
  const [interviewMode, setInterviewMode] = useState(localStorage.getItem('interview_mode') || 'audio_video')
  const [showOverlay, setShowOverlay] = useState(localStorage.getItem('show_overlay') !== 'false')
  const [saving, setSaving] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleSave = (e) => {
    e.preventDefault()
    setSaving(true)
    
    // Save details to localStorage
    localStorage.setItem('user_display_name', displayName)
    localStorage.setItem('user_job_preference', jobPreference)
    localStorage.setItem('ai_model', aiModel)
    localStorage.setItem('interview_mode', interviewMode)
    localStorage.setItem('show_overlay', showOverlay.toString())
    
    // Dispatch update event for Navbar listener
    window.dispatchEvent(new Event('settings-updated'))
    
    setTimeout(() => {
      setSaving(false)
      setToastMsg('Settings updated successfully!')
      setTimeout(() => {
        setToastMsg('')
      }, 3000)
    }, 800)
  }

  return (
    <div className="profile-page">
      <Navbar />
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="premium-toast flex items-center gap-3">
          <span className="toast-icon">✨</span>
          <span className="toast-text">{toastMsg}</span>
        </div>
      )}

      <div className="container py-12">
        <div className="settings-header mb-8">
          <h2 className="text-3xl font-extrabold">Control Center</h2>
          <p className="text-gray-400 text-sm mt-1">Configure your mock assessment parameters and workspace configurations.</p>
        </div>

        <div className="settings-grid">
          {/* Settings Sidebar Nav */}
          <div className="settings-sidebar glass-card flex flex-col gap-6">
            <div className="avatar-section flex items-center gap-4 pb-4 border-b border-gray-800">
              <div className="profile-avatar flex items-center justify-center font-bold text-xl">
                {displayName.charAt(0).toUpperCase() || 'C'}
              </div>
              <div className="user-meta flex flex-col">
                <span className="user-name font-semibold text-gray-200">{displayName}</span>
                <span className="user-email text-xs text-gray-500">{user?.email || 'loading...'}</span>
              </div>
            </div>

            <div className="sidebar-links flex flex-col gap-2">
              <button 
                className={`sidebar-link ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                👤 Account Settings
              </button>
              <button 
                className={`sidebar-link ${activeTab === 'ai_config' ? 'active' : ''}`}
                onClick={() => setActiveTab('ai_config')}
              >
                ⚙️ AI Assessment Config
              </button>
              <button 
                className={`sidebar-link ${activeTab === 'credentials' ? 'active' : ''}`}
                onClick={() => setActiveTab('credentials')}
              >
                🔒 Security & Sandbox
              </button>
            </div>
          </div>

          {/* Settings Content Panels */}
          <div className="settings-content glass-card">
            <form onSubmit={handleSave} className="flex flex-col h-full justify-between">
              
              <div className="content-pane-body">
                {activeTab === 'account' && (
                  <div className="tab-panel animate-fade-in flex flex-col gap-6">
                    <div>
                      <h3 className="panel-title font-bold text-lg">Profile Details</h3>
                      <p className="text-xs text-gray-400 mt-1">Customize how your account identifies during assessments.</p>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Target Role Preference</label>
                      <input
                        type="text"
                        className="form-input"
                        value={jobPreference}
                        onChange={(e) => setJobPreference(e.target.value)}
                        placeholder="e.g. Frontend Developer"
                        required
                      />
                    </div>

                    <div className="info-row-box flex flex-col gap-1 p-3 bg-dark-dimmed border-1">
                      <span className="info-box-lbl text-xs text-gray-500">USER ID HASH</span>
                      <span className="info-box-val text-xs font-mono text-gray-400">{user?.id || 'session-hash'}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'ai_config' && (
                  <div className="tab-panel animate-fade-in flex flex-col gap-6">
                    <div>
                      <h3 className="panel-title font-bold text-lg">AI Recruiter Engine</h3>
                      <p className="text-xs text-gray-400 mt-1">Tune LLM analytics capabilities and audio-visual capture telemetry.</p>
                    </div>

                    {/* AI Model Radio Cards */}
                    <div className="setting-block">
                      <span className="setting-block-label">LLM Intelligence Tier</span>
                      <div className="option-cards-grid mt-2">
                        <div 
                          className={`option-card ${aiModel === 'gemini-flash' ? 'active' : ''}`}
                          onClick={() => setAiModel('gemini-flash')}
                        >
                          <div className="card-header flex items-center justify-between">
                            <span className="card-title">⚡ Gemini 1.5 Flash</span>
                            <span className="card-badge">Fast & Agile</span>
                          </div>
                          <p className="card-desc">Optimized response speeds for smooth, conversational turn-taking.</p>
                        </div>
                        
                        <div 
                          className={`option-card ${aiModel === 'gemini-pro' ? 'active' : ''}`}
                          onClick={() => setAiModel('gemini-pro')}
                        >
                          <div className="card-header flex items-center justify-between">
                            <span className="card-title">🧠 Gemini 1.5 Pro</span>
                            <span className="card-badge analytics">Analytical</span>
                          </div>
                          <p className="card-desc">Advanced reasoning and deeper syntax feedback for coding trials.</p>
                        </div>
                      </div>
                    </div>

                    {/* Interview Mode Radio Cards */}
                    <div className="setting-block">
                      <span className="setting-block-label">Assessment Modality</span>
                      <div className="option-cards-grid mt-2">
                        <div 
                          className={`option-card ${interviewMode === 'audio_only' ? 'active' : ''}`}
                          onClick={() => setInterviewMode('audio_only')}
                        >
                          <div className="card-header">
                            <span className="card-title">🎙️ Audio Responses Only</span>
                          </div>
                          <p className="card-desc">Practice natural vocal articulation. Ideal for verbal phone screening simulations.</p>
                        </div>
                        
                        <div 
                          className={`option-card ${interviewMode === 'audio_video' ? 'active' : ''}`}
                          onClick={() => setInterviewMode('audio_video')}
                        >
                          <div className="card-header">
                            <span className="card-title">📹 Audio + Webcam Feedback</span>
                          </div>
                          <p className="card-desc">Practice with posture warnings, eye tracking calibrations, and gestures analysis.</p>
                        </div>
                      </div>
                    </div>

                    {/* HUD Switch Toggle */}
                    <div className="setting-block">
                      <span className="setting-block-label">Sensory Overlay Settings</span>
                      <div 
                        className={`toggle-card mt-2 ${showOverlay ? 'active' : ''}`}
                        onClick={() => setShowOverlay(!showOverlay)}
                      >
                        <div className="toggle-info">
                          <span className="toggle-title">HUD Calibration Guides</span>
                          <p className="toggle-desc">Overlay visual guides for eye tracking and posture directly on the web camera feed.</p>
                        </div>
                        <div className="toggle-switch">
                          <div className="switch-knob"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'credentials' && (
                  <div className="tab-panel animate-fade-in flex flex-col gap-6">
                    <div>
                      <h3 className="panel-title font-bold text-lg">Credentials & Backend Sandbox</h3>
                      <p className="text-xs text-gray-400 mt-1">Status of API integration parameters and database connection health.</p>
                    </div>

                    <div className="sandbox-info p-4 bg-dark-dimmed border-1 border-gray-800 flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <span className="status-dot-active"></span>
                        <span className="text-sm font-semibold">Gemini Server Context: Sandbox Active</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        The AI-Interview backend is pre-configured with secure centralized keys. Candidates do not need to provide personal Gemini API Keys. All API telemetry runs through sandboxed endpoints securely managed by the server.
                      </p>
                      <div className="flex gap-2">
                        <span className="badge-outline">HTTPS Enabled</span>
                        <span className="badge-outline">Supabase Synced</span>
                        <span className="badge-outline">ChromaDB Sandbox</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="settings-footer mt-8 pt-4 border-t border-gray-800 flex justify-end">
                <button type="submit" className="btn btn-primary px-6" disabled={saving}>
                  {saving ? (
                    <>
                      <span className="spinner"></span> Saving...
                    </>
                  ) : "Save Preferences"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
