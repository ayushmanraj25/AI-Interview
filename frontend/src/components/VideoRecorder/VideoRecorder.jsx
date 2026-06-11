import React, { useState, useEffect, useRef } from 'react'
import './VideoRecorder.css'

export default function VideoRecorder({ onFrameCapture }) {
  const [cameraActive, setCameraActive] = useState(false)
  const [analytics, setAnalytics] = useState({
    eyeContact: 85,
    posture: 'Stable',
    emotion: 'Neutral',
    confidence: 90
  })
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const analyticsIntervalRef = useRef(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
      startFakeAnalytics()
    } catch (err) {
      console.warn("Camera access blocked, rendering mockup feed:", err.message)
      setCameraActive(false)
      startFakeAnalytics()
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
    clearInterval(analyticsIntervalRef.current)
  }

  const startFakeAnalytics = () => {
    const emotions = ['Confident', 'Calm', 'Focused', 'Thinking']
    analyticsIntervalRef.current = setInterval(() => {
      setAnalytics({
        eyeContact: Math.floor(75 + Math.random() * 20),
        posture: Math.random() > 0.15 ? 'Optimal' : 'Slight Lean',
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        confidence: Math.floor(80 + Math.random() * 18)
      })
    }, 2000)
  }

  return (
    <div className="video-recorder-container glass-card">
      <div className="video-viewport">
        {cameraActive ? (
          <video ref={videoRef} autoPlay playsInline muted className="webcam-feed"></video>
        ) : (
          <div className="webcam-fallback flex flex-col items-center justify-center">
            <span className="fallback-avatar">👤</span>
            <p className="mt-2 text-sm text-gray-400">Webcam stream inactive or simulation feed active</p>
          </div>
        )}

        {/* AI HUD Overlay */}
        <div className="ai-hud-overlay">
          <div className="hud-top flex items-center justify-between">
            <span className="hud-tag rec-dot">LIVE FEED</span>
            <span className="hud-tag text-cyan">AI TRACKING ACTIVED</span>
          </div>

          {/* Simulated facial box */}
          <div className="face-tracking-box">
            <div className="corner top-left"></div>
            <div className="corner top-right"></div>
            <div className="corner bottom-left"></div>
            <div className="corner bottom-right"></div>
            <span className="face-tag">Candidate Profile</span>
          </div>

          <div className="hud-bottom grid grid-2">
            <div className="metric-box">
              <span className="metric-label">Eye Contact Ratio</span>
              <span className="metric-val text-indigo">{analytics.eyeContact}%</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Posture Status</span>
              <span className="metric-val text-green">{analytics.posture}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Primary Emotion</span>
              <span className="metric-val text-cyan">{analytics.emotion}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Confidence Indicator</span>
              <span className="metric-val text-cyan">{analytics.confidence}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="video-controls mt-4 flex justify-between items-center">
        <span className="text-xs text-gray-400">Press recording button below when ready.</span>
        <button onClick={cameraActive ? stopCamera : startCamera} className="btn btn-secondary py-1 px-3 text-xs">
          {cameraActive ? "⏹️ Disable Cam" : "🎥 Enable Cam"}
        </button>
      </div>
    </div>
  )
}
