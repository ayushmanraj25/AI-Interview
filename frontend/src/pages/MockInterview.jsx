import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import QuestionCard from '../components/QuestionCard/QuestionCard'
import VoiceRecorder from '../components/VoiceRecorder/VoiceRecorder'
import { interviewService } from '../services/interviewService'
import { reportService } from '../services/reportService'
import './MockInterview.css'

export default function MockInterview() {
  const [searchParams] = useSearchParams()
  const role = searchParams.get('role') || 'Software Developer'
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const data = await interviewService.getQuestions(role, "")
      setQuestions(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleRecordingComplete = async (audioBlob) => {
    // Record current answer
    const currentQuestion = questions[currentIdx]
    
    // Simulate transcribing answer via service
    setSubmitting(true)
    try {
      const transcription = await interviewService.submitAudioResponse(audioBlob, currentQuestion.id)
      
      const newAnswer = {
        question_id: currentQuestion.id,
        question: currentQuestion.text,
        answer: transcription.text,
        filler_words: transcription.filler_words,
        speech_rate: transcription.speech_rate
      }

      const updatedAnswers = [...answers, newAnswer]
      setAnswers(updatedAnswers)

      // Move to next question or submit final interview
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(currentIdx + 1)
      } else {
        await finishInterview(updatedAnswers)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  const finishInterview = async (finalAnswers) => {
    setLoading(true)
    try {
      const report = await reportService.generateReport('session-xyz', finalAnswers)
      // Save report in local storage for results access
      localStorage.setItem('last_report', JSON.stringify(report))
      navigate(`/results?session_id=${report.id || 'mock-id'}`)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mock-interview-page">

      <Navbar />
      <div className="container py-12 flex flex-col items-center justify-center max-w-2xl gap-6">
        
        <div className="session-info text-center w-full flex justify-between items-center glass-card py-2 px-4">
          <span className="text-sm text-gray-400 font-medium">Assessing: {role}</span>
          <button onClick={() => navigate('/video')} className="btn btn-secondary py-1 px-3 text-xs">
            🎥 Switch to Video Assessment
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="spinner"></div>
            <p className="mt-4 text-gray-400">Loading interview workspace...</p>
          </div>
        ) : questions.length > 0 ? (
          <div className="interview-workspace w-full flex flex-col gap-6">
            <QuestionCard
              question={questions[currentIdx]}
              currentIdx={currentIdx}
              totalQuestions={questions.length}
            />

            {submitting ? (
              <div className="glass-card flex flex-col items-center p-6 text-center">
                <span className="spinner"></span>
                <span className="mt-3 text-sm text-gray-400">Analyzing answer response & computing verbal scores...</span>
              </div>
            ) : (
              <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
            )}
          </div>
        ) : (
          <div className="glass-card p-6 text-center">
            <p className="text-gray-400">Could not retrieve questions. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  )
}
