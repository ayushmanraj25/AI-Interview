import { request } from './api'

export const interviewService = {
  async getQuestions(jobTitle = "Software Engineer", resumeText = "") {
    return request('/interview/questions', {
      method: 'POST',
      body: JSON.stringify({ job_title: jobTitle, resume_text: resumeText })
    })
  },

  async submitAudioResponse(audioBlob, questionId) {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'response.wav')
    formData.append('question_id', questionId)

    // Using request helper with custom configs
    return request('/speech/transcribe', {
      method: 'POST',
      body: formData,
      headers: {
        // Let fetch set boundary for multi-part formdata
      }
    })
  },

  async submitVideoFrame(videoBlob, questionId) {
    const formData = new FormData()
    formData.append('video', videoBlob, 'frame.webm')
    formData.append('question_id', questionId)

    return request('/vision/analyze', {
      method: 'POST',
      body: formData
    })
  },

  async saveInterviewLogs(logs) {
    return request('/interview/save', {
      method: 'POST',
      body: JSON.stringify({ logs })
    })
  }
}
