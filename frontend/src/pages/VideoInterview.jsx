import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import QuestionCard from '../components/QuestionCard/QuestionCard'
import VideoRecorder from '../components/VideoRecorder/VideoRecorder'
import VoiceRecorder from '../components/VoiceRecorder/VoiceRecorder'
import { interviewService } from '../services/interviewService'
import { reportService } from '../services/reportService'
import './VideoInterview.css'

export default function VideoInterview() {
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
      const data = await interviewService.getQuestions('Full Stack Engineer', '')
      setQuestions(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleRecordingComplete = async (audioBlob) => {
    const currentQuestion = questions[currentIdx]
    setSubmitting(true)
    try {
      // Send audio response
      const transcription = await interviewService.submitAudioResponse(audioBlob, currentQuestion.id)
      // Send mock video frame data
      const visionData = await interviewService.submitVideoFrame(new Blob([]), currentQuestion.id)

      const newAnswer = {
        question_id: currentQuestion.id,
        question: currentQuestion.text,
        answer: transcription.text,
        filler_words: transcription.filler_words,
        speech_rate: transcription.speech_rate,
        vision_feedback: visionData
      }

      const updatedAnswers = [...answers, newAnswer]
      setAnswers(updatedAnswers)

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
      const report = await reportService.generateReport('session-video-xyz', finalAnswers)
      localStorage.setItem('last_report', JSON.stringify(report))
      navigate(`/results?session_id=${report.id}`)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="video-interview-page">

      <Navbar />
      <div className="container py-8 grid grid-2 gap-6 items-start">
        
        {/* Left Side - Video Feed */}
        <div className="video-column flex flex-col gap-4">
          <div className="workspace-header glass-card py-2 px-4 flex justify-between items-center">
            <span className="text-xs text-cyan font-mono">WORKSPACE: VIDEO_ASSESSMENT</span>
            <span className="text-xs text-gray-400">FPS: 30 / RESOLUTION: 720p</span>
          </div>
          <VideoRecorder />
        </div>

        {/* Right Side - Interactive workspace */}
        <div className="workspace-column flex flex-col gap-4">
          {loading ? (
            <div className="glass-card flex flex-col items-center justify-center py-12">
              <span className="spinner"></span>
              <p className="mt-2 text-sm text-gray-400">Loading interview questions...</p>
            </div>
          ) : questions.length > 0 ? (
            <>
              <QuestionCard
                question={questions[currentIdx]}
                currentIdx={currentIdx}
                totalQuestions={questions.length}
              />

              {submitting ? (
                <div className="glass-card flex flex-col items-center p-6 text-center">
                  <span className="spinner"></span>
                  <span className="mt-3 text-sm text-gray-400">Processing audio and facial confidence markers...</span>
                </div>
              ) : (
                <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
              )}
            </>
          ) : (
            <div className="glass-card p-6 text-center">
              <p className="text-gray-400">No questions loaded.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
