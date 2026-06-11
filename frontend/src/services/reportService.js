import { request } from './api'

export const reportService = {
  async generateReport(interviewSessionId, answersData) {
    return request('/report/generate', {
      method: 'POST',
      body: JSON.stringify({
        session_id: interviewSessionId,
        answers: answersData
      })
    })
  },

  async getReport(reportId) {
    return request(`/report/${reportId}`, {
      method: 'GET'
    })
  },

  async downloadReportPdf(reportId) {
    // Return mock PDF download blob URL or actual backend URL
    try {
      const response = await fetch(`/api/report/${reportId}/download`)
      if (response.ok) {
        const blob = await response.blob()
        return URL.createObjectURL(blob)
      }
    } catch (e) {
      console.warn("Could not download actual PDF from backend, creating mock blob:")
    }
    // Mock PDF file blob
    const mockBlob = new Blob(["AI Interview Performance Report PDF Content"], { type: 'application/pdf' })
    return URL.createObjectURL(mockBlob)
  }
}
