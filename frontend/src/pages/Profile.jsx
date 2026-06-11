import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar/Navbar'
import { authService } from '../services/authService'
import './Profile.css'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [displayName, setDisplayName] = useState('John Doe')
  const [jobPreference, setJobPreference] = useState('Frontend Developer')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleSave = (e) => {
    e.preventDefault()
    setSaving(true)
    setSavedMsg(false)
    setTimeout(() => {
      setSaving(false)
      setSavedMsg(true)
    }, 1000)
  }

  return (
    <div className="profile-page">

      <Navbar />
      <div className="container py-12 flex flex-col items-center max-w-xl gap-8">
        <div className="text-center w-full">
          <h2 className="text-3xl font-extrabold">Account Settings</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your mock assessment credentials and preferences.</p>
        </div>

        <div className="profile-card glass-card w-full">
          <div className="avatar-section flex flex-col items-center pb-6 border-b border-gray-800">
            <div className="profile-avatar flex items-center justify-center font-bold text-3xl">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="profile-email mt-3 text-gray-200 font-semibold">{user?.email}</span>
            <span className="profile-id mt-1 text-xs text-gray-500">USER ID: {user?.id}</span>
          </div>

          <form onSubmit={handleSave} className="mt-6 flex flex-col gap-4">
            {savedMsg && (
              <div className="success-banner py-2 px-3 text-center text-sm text-success">
                ✅ Settings Saved Successfully!
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Role Preference</label>
              <input
                type="text"
                className="form-input"
                value={jobPreference}
                onChange={(e) => setJobPreference(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full mt-4" disabled={saving}>
              {saving ? <span className="spinner"></span> : "Save Preferences"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
