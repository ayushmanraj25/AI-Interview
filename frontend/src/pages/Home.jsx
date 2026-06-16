import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import './Home.css'

export default function Home() {
  return (
    <div className="home-page">

      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section container flex flex-col items-center justify-center text-center mt-12 py-16">
        <h1 className="hero-title font-extrabold">
          Ace Your Next Interview with <br />
          <span className="gradient-text">AI Coach Insights</span>
        </h1>
        <p className="hero-subtitle mt-6 max-w-2xl text-gray-400">
          Upload your resume, parse your skills, and undergo realistic mock audio and video interviews. Get real-time posture, confidence, and speech analytics graded by state-of-the-art AI.
        </p>
        <div className="hero-buttons mt-8 flex gap-4">
          <Link to="/register" className="btn btn-primary btn-lg">Start Free Interview</Link>
          <Link to="/login" className="btn btn-secondary btn-lg">View Demo</Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section container py-12">
        <h2 className="section-title text-center text-3xl font-bold mb-10">Advanced Features</h2>
        <div className="grid grid-3 gap-6">
          <div className="feature-card glass-card text-center p-6">
            <span className="feature-emoji">📄</span>
            <h3 className="text-xl font-semibold mt-4 mb-2">Resume Parsing</h3>
            <p className="text-sm text-gray-400">Upload your PDF and extract skills, experience, and custom questions mapped to your job role.</p>
          </div>

          <div className="feature-card glass-card text-center p-6">
            <span className="feature-emoji">🎤</span>
            <h3 className="text-xl font-semibold mt-4 mb-2">Speech Analysis</h3>
            <p className="text-sm text-gray-400">Analyzes pronunciation, communication pace, and detects filler words like 'um', 'like', and 'ah' automatically.</p>
          </div>

          <div className="feature-card glass-card text-center p-6">
            <span className="feature-emoji">👁️</span>
            <h3 className="text-xl font-semibold mt-4 mb-2">AI Eye-Tracking</h3>
            <p className="text-sm text-gray-400">Webcam tracking checks your body posture, gestures, and displays facial emotion cues in real-time.</p>
          </div>
        </div>
      </section>
      
      {/* Step Flow */}
      <section className="flow-section container py-12 mb-16 text-center">
        <h2 className="section-title text-3xl font-bold mb-10">How it Works</h2>
        <div className="flow-steps grid grid-3 gap-6">
          <div className="flow-step flex flex-col items-center">
            <div className="step-number">1</div>
            <h4 className="font-semibold mt-2">Upload Profile</h4>
            <p className="text-xs text-gray-400 mt-1">Upload resume PDF to tailor questions</p>
          </div>
          <div className="flow-step flex flex-col items-center">
            <div className="step-number">2</div>
            <h4 className="font-semibold mt-2">Mock Session</h4>
            <p className="text-xs text-gray-400 mt-1">Record audio/video answers to queries</p>
          </div>
          <div className="flow-step flex flex-col items-center">
            <div className="step-number">3</div>
            <h4 className="font-semibold mt-2">AI Report</h4>
            <p className="text-xs text-gray-400 mt-1">Download custom performance scores</p>
          </div>
        </div>
      </section>
    </div>
  )
}
