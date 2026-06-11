import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import ResumeUpload from '../components/ResumeUpload/ResumeUpload'
import './ResumeAnalysis.css'

export default function ResumeAnalysis() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [jobTitle, setJobTitle] = useState('Frontend Engineer')
  const navigate = useNavigate()

  const handleUploadComplete = (file) => {
    // Simulate API call to parse resume using fallback mocks
    setTimeout(() => {
      setAnalysisResult({
        success: true,
        skills: ['React', 'JavaScript', 'HTML5/CSS3', 'Node.js', 'Express', 'Git', 'Webpack', 'Rest APIs'],
        experience_years: 2.5,
        education: 'Bachelor of Science in Computer Science',
        suggested_roles: ['Frontend Developer', 'React Developer', 'UI Engineer']
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
                <span className="info-value text-indigo">{analysisResult.experience_years} Years</span>
              </div>
              <div className="info-box">
                <span className="info-label">Education Context</span>
                <span className="info-value text-cyan">{analysisResult.education}</span>
              </div>
            </div>

            <div className="skills-extracted">
              <span className="section-label">Skills Extracted:</span>
              <div className="skills-badge-container mt-2 flex flex-wrap gap-2">
                {analysisResult.skills.map((skill, idx) => (
                  <span key={idx} className="skill-badge">{skill}</span>
                ))}
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
