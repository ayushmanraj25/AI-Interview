# AI-Interview Platform

A comprehensive, state-of-the-art AI-driven Mock Interview Platform that analyzes user resumes, conducts personalized mock interviews (voice & video), tracks performance, detects facial expressions/posture/emotion, checks for communication metrics (like filler words, speech speed), and generates comprehensive analysis reports.

## Features

- **Resume Analysis & RAG**: Upload a resume, parse skills, and retrieve targeted, relevant interview questions using Retrieval-Augmented Generation (RAG).
- **Interactive Mock Interviews**:
  - **Voice Interview**: Voice-to-text response capture via Whisper.
  - **Video Interview**: Real-time camera capture tracking posture, eye contact, gestures, and emotions.
- **AI Evaluator**: Evaluate responses using Gemini LLM for depth, accuracy, relevance, and formatting.
- **Comprehensive Reports**: Detailed score breakdown, communicative feedback, and visual performance charts with downloadable PDF reports.

## Repository Structure

```text
AI-Interview/
├── frontend/          # React + Vite + Tailwind CSS UI app
├── backend/           # FastAPI service handling ML, Speech, Vision, and RAG
├── vector_db/         # Persistent vector storage for RAG queries
├── uploads/           # User uploads (Resumes, Audios, Videos, Reports)
├── docs/              # System architecture, diagrams, and project reports
└── docker/            # Docker deployment configurations
```

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose
- API Keys: Gemini API Key

### Backend Setup
1. Navigate to backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set environment variables in `.env`:
   ```env
   GEMINI_API_KEY=your_key_here
   DATABASE_URL=postgresql://user:pass@localhost:5432/ai_interview
   MONGO_URI=mongodb://localhost:27017/ai_interview
   ```
4. Run server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

### Docker Compose
To run the entire system including databases (PostgreSQL, MongoDB, Chromadb), backend, and frontend:
```bash
docker-compose -f docker/docker-compose.yml up --build
```
# AI-Interview
