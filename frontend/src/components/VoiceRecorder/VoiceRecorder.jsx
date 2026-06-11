import React, { useState, useEffect, useRef } from 'react'
import './VoiceRecorder.css'

export default function VoiceRecorder({ onRecordingComplete }) {
  const [recording, setRecording] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [timer, setTimer] = useState(0)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerIntervalRef = useRef(null)
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    return () => {
      stopTimer()
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  const startTimer = () => {
    setTimer(0)
    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60)
    const remainSecs = secs % 60
    return `${mins.toString().padStart(2, '0')}:${remainSecs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    audioChunksRef.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        setProcessing(true)
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        
        // Simulate speech-to-text delay
        setTimeout(() => {
          setProcessing(false)
          if (onRecordingComplete) {
            onRecordingComplete(audioBlob)
          }
        }, 1500)

        // Stop all audio tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setRecording(true)
      startTimer()
      startWaveformAnimation()
    } catch (err) {
      console.warn("Microphone access blocked or failed, simulating record mode:", err.message)
      setRecording(true)
      startTimer()
      startWaveformAnimation()
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    } else {
      // Simulation stop path
      setRecording(false)
      stopTimer()
      setProcessing(true)
      setTimeout(() => {
        setProcessing(false)
        if (onRecordingComplete) {
          // Send mock empty audio blob
          onRecordingComplete(new Blob([], { type: 'audio/wav' }))
        }
      }, 1500)
    }
    setRecording(false)
    stopTimer()
    cancelAnimationFrame(animationFrameRef.current)
    clearCanvas()
  }

  // Draw dynamic fake waveform bars
  const startWaveformAnimation = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#06b6d4' // Cyan highlight

      const barWidth = 4
      const gap = 3
      const numBars = Math.floor(width / (barWidth + gap))

      for (let i = 0; i < numBars; i++) {
        // Generate random amplitude centered around screen middle
        const amplitude = Math.random() * (height * 0.7)
        const y = (height - amplitude) / 2
        ctx.fillRect(i * (barWidth + gap), y, barWidth, amplitude)
      }
      animationFrameRef.current = requestAnimationFrame(draw)
    }
    draw()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className="voice-recorder flex flex-col items-center justify-center p-4">
      <div className="waveform-container flex items-center justify-center">
        <canvas ref={canvasRef} width="300" height="60" className="waveform-canvas"></canvas>
      </div>

      <div className="recorder-status mt-2 flex items-center gap-2">
        {recording && <span className="pulse-dot"></span>}
        <span className="status-label">
          {recording ? `Recording... (${formatTime(timer)})` : processing ? "Transcribing with AI..." : "Press record to answer"}
        </span>
      </div>

      <div className="recorder-controls mt-4">
        {!recording && !processing ? (
          <button onClick={startRecording} className="btn btn-primary record-btn flex items-center">
            🎤 Start Response
          </button>
        ) : recording ? (
          <button onClick={stopRecording} className="btn btn-danger record-btn flex items-center">
            ⏹️ Stop & Submit
          </button>
        ) : (
          <button disabled className="btn btn-secondary record-btn flex items-center">
            <span className="spinner"></span> Parsing Answer...
          </button>
        )}
      </div>
    </div>
  )
}
