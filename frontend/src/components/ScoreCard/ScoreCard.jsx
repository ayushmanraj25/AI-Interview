import React from 'react'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import './ScoreCard.css'

// Register Chart.js components for Radar chart
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

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

  // Compute Pace and Vocabulary derived scores for a 5-dimension visualization
  const pace_score = Math.max(40, Math.min(100, Math.round(communication_score * 0.95)))
  const vocabulary_score = Math.max(40, Math.min(100, Math.round(technical_score * 1.02)))

  const radarData = {
    labels: ['Technical', 'Communication', 'Body Language', 'Pace', 'Vocabulary'],
    datasets: [
      {
        label: 'Candidate Score',
        data: [technical_score, communication_score, body_language_score, pace_score, vocabulary_score],
        backgroundColor: 'rgba(16, 185, 129, 0.15)', // Sage green transparent fill
        borderColor: '#10b981', // Sage green border
        borderWidth: 2,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#10b981',
        pointRadius: 3
      }
    ]
  }

  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.08)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)'
        },
        pointLabels: {
          color: '#e2e8f0',
          font: {
            family: 'Inter, system-ui, -apple-system, sans-serif',
            size: 11,
            weight: '600'
          }
        },
        ticks: {
          backdropColor: 'transparent',
          color: 'rgba(255, 255, 255, 0.3)',
          showLabelBackdrop: false,
          stepSize: 20,
          font: {
            size: 9
          }
        },
        min: 0,
        max: 100
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ${context.raw}%`
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  }

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
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>
        </svg>
        <div className="overall-score-text flex flex-col items-center">
          <span className="score-number">{overall_score}</span>
          <span className="score-max">/100</span>
        </div>
      </div>

      {/* Radar Chart Container */}
      <div className="radar-chart-container">
        <Radar data={radarData} options={radarOptions} />
      </div>

      <div className="metrics-breakdown mt-6 w-full grid grid-3 gap-4">
        <div className="metric-item glass-card flex flex-col items-center p-3">
          <span className="metric-score text-indigo" style={{ color: '#818cf8' }}>{technical_score}%</span>
          <span className="metric-name">Technical</span>
        </div>
        <div className="metric-item glass-card flex flex-col items-center p-3">
          <span className="metric-score text-cyan" style={{ color: '#22d3ee' }}>{communication_score}%</span>
          <span className="metric-name">Speech & Delivery</span>
        </div>
        <div className="metric-item glass-card flex flex-col items-center p-3">
          <span className="metric-score text-green" style={{ color: '#10b981' }}>{body_language_score}%</span>
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
