import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import ScoreCard from '../components/ScoreCard/ScoreCard'
import ReportViewer from '../components/ReportViewer/ReportViewer'
import { reportService } from '../services/reportService'
import './Results.css'

export default function Results() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReport()
  }, [sessionId])

  const loadReport = async () => {
    // Check if we have the report cached in localStorage from the active session
    const cached = localStorage.getItem('last_report')
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        setReport(parsed)
        setLoading(false)
        return
      } catch (e) {
        console.error(e)
      }
    }

    // Otherwise fetch from service
    try {
      const data = await reportService.getReport(sessionId || 'session-xyz')
      setReport(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="results-page">

      <Navbar />
      
      <div className="container py-12 flex flex-col items-center gap-8 max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold gradient-text">Assessment Feedback</h2>
          <p className="text-gray-400 text-sm mt-1">Review your technical answers, body language, and communication performance.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="spinner"></span>
            <p className="mt-4 text-gray-400">Compiling report analysis data...</p>
          </div>
        ) : report ? (
          <>
            <ScoreCard report={report} />
            <ReportViewer report={report} />
            
            <div className="results-actions mt-6 flex gap-4">
              <Link to="/dashboard" className="btn btn-secondary">
                Dashboard
              </Link>
              <Link to="/resume" className="btn btn-primary">
                Try Another Assessment
              </Link>
            </div>
          </>
        ) : (
          <div className="glass-card p-6 text-center">
            <p className="text-gray-400">Report details could not be found or loaded.</p>
          </div>
        )}
      </div>
    </div>
  )
}
