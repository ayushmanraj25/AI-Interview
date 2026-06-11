import React, { useState } from 'react'
import { reportService } from '../../services/reportService'
import './ReportViewer.css'

export default function ReportViewer({ report }) {
  const [downloading, setDownloading] = useState(false)

  if (!report) return null

  const {
    id = "report-123",
    feedback = "Overall feedback not available",
    question_breakdown = []
  } = report

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const pdfUrl = await reportService.downloadReportPdf(id)
      const link = document.createElement('a')
      link.href = pdfUrl
      link.setAttribute('download', `AI_Interview_Report_${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (e) {
      console.error(e)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="report-viewer glass-card mt-6 w-full">
      <div className="report-header flex justify-between items-center pb-4">
        <div>
          <h3 className="text-xl font-bold">Detailed Question Evaluation</h3>
          <span className="text-xs text-gray-400">Report Session ID: {id}</span>
        </div>
        <button onClick={handleDownload} className="btn btn-secondary py-1 px-4 flex items-center gap-2" disabled={downloading}>
          {downloading ? (
            <>
              <span className="spinner"></span> Downloading...
            </>
          ) : (
            <>
              📥 Download PDF Report
            </>
          )}
        </button>
      </div>

      <div className="breakdown-list mt-6 flex flex-col gap-4">
        {question_breakdown.map((item, idx) => (
          <div key={idx} className="breakdown-item glass-card">
            <div className="item-header flex justify-between items-center">
              <span className="question-label font-semibold">Question {idx + 1}</span>
              <span className={`item-score py-1 px-3 rounded-full font-bold ${item.score >= 85 ? 'high' : item.score >= 70 ? 'medium' : 'low'}`}>
                {item.score}%
              </span>
            </div>
            
            <p className="item-question mt-2 font-medium text-gray-300">"{item.question}"</p>
            
            <div className="feedback-sub-box mt-4">
              <span className="feedback-label">Coach Review:</span>
              <p className="item-feedback mt-1 text-sm text-gray-400">{item.feedback}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
