import React from 'react'
import './QuestionCard.css'

export default function QuestionCard({ question, currentIdx, totalQuestions }) {
  if (!question) return null

  const progressPercent = ((currentIdx + 1) / totalQuestions) * 100

  return (
    <div className="question-card glass-card">
      <div className="card-header flex items-center justify-between">
        <span className="question-number">Question {currentIdx + 1} of {totalQuestions}</span>
        <span className="question-category">Technical Assessment</span>
      </div>
      
      <div className="progress-bar-container mt-2">
        <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
      </div>
      
      <div className="question-body mt-6">
        <p className="question-text">{question.text}</p>
      </div>

      <div className="tips-container mt-6">
        <details className="tips-details">
          <summary className="tips-summary">💡 View Answering Tips</summary>
          <ul className="tips-list mt-2">
            <li>Structure your answer using the **STAR** method (Situation, Task, Action, Result).</li>
            <li>Maintain clear, steady articulation and avoid filler words.</li>
            <li>Incorporate relevant technical keywords specific to the question domain.</li>
          </ul>
        </details>
      </div>
    </div>
  )
}
