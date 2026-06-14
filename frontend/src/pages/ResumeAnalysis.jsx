import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import ResumeUpload from '../components/ResumeUpload/ResumeUpload'
import './ResumeAnalysis.css'

export default function ResumeAnalysis() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [jobTitle, setJobTitle] = useState('Frontend Engineer')
  const [activeTab, setActiveTab] = useState('skills')
  const navigate = useNavigate()

  const handleUploadComplete = (file) => {
    // Simulate API call to parse resume using fallback mocks
    setTimeout(() => {
      setAnalysisResult({
        success: true,
        skills: ['React', 'JavaScript', 'HTML5/CSS3', 'Node.js', 'Express', 'Git', 'Webpack', 'Rest APIs'],
        experience_years: 2.5,
        education: 'Bachelor of Science in Computer Science',
        suggested_roles: ['Frontend Developer', 'React Developer', 'UI Engineer'],
        roadmap: [
          { topic: 'System Design', desc: 'Study frontend caching, bundler optimizations, and CDN configurations.' },
          { topic: 'Advanced State Management', desc: 'Deep dive into Redux Toolkit, Zustand, or React Context API.' },
          { topic: 'Performance Auditing', desc: 'Optimize Core Web Vitals (LCP, FID, INP) and profiling with DevTools.' }
        ]
      })
    }, 1000)
  }

  const handleProceed = () => {
    navigate(`/mock?role=${encodeURIComponent(jobTitle)}`)
  }

  return (
    <div className="resume-analysis-page">

      <Navbar />
      <div className="container py-12 flex flex-col gap-8 max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">Resume Analysis & Profiler</h2>
          <p className="text-gray-400 text-sm mt-1">Upload your CV to extract key technical competencies and match job descriptions.</p>
        </div>

        <ResumeUpload onUploadComplete={handleUploadComplete} />

        {analysisResult && (
          <div className="analysis-results-card glass-card flex flex-col gap-6">
            <h3 className="text-xl font-bold border-b border-gray-800 pb-3">AI Analysis Report</h3>
            
            <div className="grid grid-2 gap-4">
              <div className="info-box">
                <span className="info-label">Detected Experience</span>
                <span className="info-value text-indigo" style={{ color: '#818cf8' }}>{analysisResult.experience_years} Years</span>
              </div>
              <div className="info-box">
                <span className="info-label">Education Context</span>
                <span className="info-value text-cyan" style={{ color: '#22d3ee' }}>{analysisResult.education}</span>
              </div>
            </div>

            {/* Tabbed Category Navigation */}
            <div className="tabs-container">
              <div className="tabs-headers flex gap-2 border-b border-gray-800 pb-2 mb-4">
                <button 
                  className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
                  onClick={() => setActiveTab('skills')}
                >
                  Parsed Skills
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
                  onClick={() => setActiveTab('roles')}
                >
                  Suggested Roles
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
                  onClick={() => setActiveTab('roadmap')}
                >
                  Growth Roadmap
                </button>
              </div>

              <div className="tab-content transition-all duration-200">
                {activeTab === 'skills' && (
                  <div className="skills-extracted animate-fade-in">
                    <span className="section-label">Technical Competencies:</span>
                    <div className="skills-badge-container mt-3 flex flex-wrap gap-2">
                      {analysisResult.skills.map((skill, idx) => (
                        <span key={idx} className="skill-badge">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'roles' && (
                  <div className="suggested-roles animate-fade-in">
                    <span className="section-label">Matched Job Roles:</span>
                    <p className="text-xs text-gray-400 mt-1 mb-3">Select a role below to configure your upcoming mock interview session.</p>
                    <div className="roles-list-container flex flex-col gap-2">
                      {analysisResult.suggested_roles.map((role, idx) => (
                        <div 
                          key={idx} 
                          className="role-item-box p-3 glass-card flex justify-between items-center cursor-pointer hover-accent" 
                          onClick={() => setJobTitle(role)}
                        >
                          <span className="font-semibold text-gray-200">{role}</span>
                          <span className="text-xs text-brand-primary" style={{ color: '#10b981' }}>Select Role →</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'roadmap' && (
                  <div className="learning-roadmap animate-fade-in">
                    <span className="section-label">Preparation Roadmap:</span>
                    <p className="text-xs text-gray-400 mt-1 mb-3">Recommended learning focus areas based on your background.</p>
                    <div className="roadmap-timeline flex flex-col gap-3">
                      {analysisResult.roadmap.map((step, idx) => (
                        <div key={idx} className="roadmap-step p-3 glass-card border-l-2" style={{ borderLeftColor: '#10b981' }}>
                          <span className="step-title font-bold text-sm block text-gray-200">{step.topic}</span>
                          <p className="step-desc text-xs text-gray-400 mt-1">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="setup-interview border-t border-gray-800 pt-6">
              <h4 className="font-semibold mb-3">Target Assessment Role</h4>
              <div className="form-group mb-4">
                <input
                  type="text"
                  className="form-input"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Frontend Engineer"
                />
              </div>
              <button onClick={handleProceed} className="btn btn-primary w-full">
                🚀 Proceed to AI Mock Interview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
