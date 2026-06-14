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
  
  // Audio API refs for real visualizer
  const audioCtxRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    return () => {
      stopTimer()
      cleanupAudio()
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

  const cleanupAudio = () => {
    cancelAnimationFrame(animationFrameRef.current)
    stopTimer()
    
    if (sourceRef.current) {
      sourceRef.current.disconnect()
      sourceRef.current = null
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect()
      analyserRef.current = null
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close()
      audioCtxRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60)
    const remainSecs = secs % 60
    return `${mins.toString().padStart(2, '0')}:${remainSecs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    audioChunksRef.current = []
    cleanupAudio()

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      // Setup Web Audio API for real-time visualization
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 128 // 64 frequency bins
      
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      
      audioCtxRef.current = audioContext
      analyserRef.current = analyser
      sourceRef.current = source

      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        setProcessing(true)
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        
        setTimeout(() => {
          setProcessing(false)
          if (onRecordingComplete) {
            onRecordingComplete(audioBlob)
          }
        }, 1500)
      }

      mediaRecorderRef.current.start()
      setRecording(true)
      startTimer()
      startRealWaveform()
    } catch (err) {
      console.warn("Real mic access failed, starting simulation recorder:", err.message)
      setRecording(true)
      startTimer()
      startSimulatedWaveform()
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    } else {
      // Simulation fallback stop path
      setRecording(false)
      stopTimer()
      setProcessing(true)
      setTimeout(() => {
        setProcessing(false)
        if (onRecordingComplete) {
          onRecordingComplete(new Blob([], { type: 'audio/wav' }))
        }
      }, 1500)
    }
    
    setRecording(false)
    cleanupAudio()
    clearCanvas()
  }

  // Visualizer: Draw actual voice frequency bars
  const startRealWaveform = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const analyser = analyserRef.current

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!analyserRef.current) return
      
      analyser.getByteFrequencyData(dataArray)
      ctx.clearRect(0, 0, width, height)

      // Accent color: Sage Green (#10b981)
      ctx.fillStyle = '#10b981'
      
      const barWidth = (width / bufferLength) * 1.5
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        // Value between 0 and 255
        const value = dataArray[i]
        const percent = value / 255
        const amplitude = percent * (height * 0.8)
        const y = (height - amplitude) / 2

        ctx.fillRect(x, y, barWidth - 2, amplitude)
        x += barWidth
      }
      
      animationFrameRef.current = requestAnimationFrame(draw)
    }
    draw()
  }

  // Visualizer: Draw a smooth sine-wave simulation if mic not permitted
  const startSimulatedWaveform = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    let time = 0

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 3
      ctx.beginPath()

      for (let x = 0; x < width; x++) {
        const y = (height / 2) + Math.sin(x * 0.05 + time) * 15 * Math.sin(time * 0.5)
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      
      ctx.stroke()
      time += 0.1
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
        <canvas ref={canvasRef} width="340" height="70" className="waveform-canvas"></canvas>
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
