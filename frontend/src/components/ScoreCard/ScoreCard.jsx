import React from 'react'
import './ScoreCard.css'

export default function ScoreCard({ report }) {
  if (!report) return null

  const {
    overall_score = 80,
    technical_score = 80,
    communication_score = 80,
    body_language_score = 80,
    feedback = "Good response"
  } = report

  // Circular progress SVG constants
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (overall_score / 100) * circumference

  return (
    <div className="score-card-container glass-card flex flex-col items-center">
      <h3 className="text-xl font-bold mb-4">Interview Evaluation Score</h3>
      
      <div className="overall-score-circle flex items-center justify-center">
        <svg className="progress-ring" width="120" height="120">
          <circle
            className="progress-ring-bg"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          <circle
            className="progress-ring-fill"
            stroke="url(#scoreGrad)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="overall-score-text flex flex-col items-center">
          <span className="score-number">{overall_score}</span>
          <span className="score-max">/100</span>
        </div>
      </div>

      <div className="metrics-breakdown mt-6 w-full grid grid-3 gap-4">
        <div className="metric-item glass-card flex flex-col items-center p-3">
          <span className="metric-score text-indigo">{technical_score}%</span>
          <span className="metric-name">Technical</span>
        </div>
        <div className="metric-item glass-card flex flex-col items-center p-3">
          <span className="metric-score text-cyan">{communication_score}%</span>
          <span className="metric-name">Speech & Delivery</span>
        </div>
        <div className="metric-item glass-card flex flex-col items-center p-3">
          <span className="metric-score text-green">{body_language_score}%</span>
          <span className="metric-name">Body Language</span>
        </div>
      </div>

      <div className="feedback-section mt-6 w-full">
        <h4 className="feedback-header">AI Coach Insights</h4>
        <div className="feedback-content-box mt-2">
          <p className="feedback-text">{feedback}</p>
        </div>
      </div>
    </div>
  )
}
