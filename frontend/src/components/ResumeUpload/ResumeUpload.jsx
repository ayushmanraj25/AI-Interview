import React, { useState } from 'react'
import './ResumeUpload.css'

export default function ResumeUpload({ onUploadComplete }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const processFile = (selectedFile) => {
    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file only.")
      return
    }
    setFile(selectedFile)
    simulateUpload(selectedFile)
  }

  const simulateUpload = (selectedFile) => {
    setUploading(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          if (onUploadComplete) {
            onUploadComplete(selectedFile)
          }
          return 100
        }
        return prev + 10
      })
    }, 150)
  }

  return (
    <div className={`resume-upload glass-card ${dragActive ? 'drag-active' : ''}`}
         onDragEnter={handleDrag}
         onDragOver={handleDrag}
         onDragLeave={handleDrag}
         onDrop={handleDrop}>
      
      {!file && !uploading ? (
        <div className="upload-container flex flex-col items-center justify-center p-6 text-center">
          <div className="upload-icon">📄</div>
          <p className="upload-text mt-4">Drag and drop your resume PDF here</p>
          <span className="upload-subtext">or</span>
          <label htmlFor="resume-file" className="btn btn-primary mt-2">
            Browse File
          </label>
          <input
            id="resume-file"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden-file-input"
          />
        </div>
      ) : (
        <div className="progress-container flex flex-col p-4">
          <div className="file-info flex items-center justify-between">
            <span className="file-name">📄 {file?.name}</span>
            <span className="file-size">{((file?.size || 0) / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          {uploading ? (
            <div className="progress-bar-wrapper mt-4">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              <span className="progress-label mt-1">{progress}% Uploading...</span>
            </div>
          ) : (
            <div className="success-label mt-4 flex items-center gap-2 text-success">
              <span>✅</span> File Uploaded Successfully & Parsed by AI.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
