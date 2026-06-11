import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ResumeAnalysis from './pages/ResumeAnalysis'
import MockInterview from './pages/MockInterview'
import VideoInterview from './pages/VideoInterview'
import Results from './pages/Results'
import Profile from './pages/Profile'

function App() {
  return (
    <Router>
      <div className="app bg-slate-900 text-white min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume" element={<ResumeAnalysis />} />
          <Route path="/mock" element={<MockInterview />} />
          <Route path="/video" element={<VideoInterview />} />
          <Route path="/results" element={<Results />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
