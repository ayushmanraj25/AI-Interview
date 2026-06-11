from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, resume, interview, speech, vision, report

app = FastAPI(
    title="AI-Powered Multimodal Interview Preparation System API",
    description="Backend services for RAG, Speech, Vision, and LLM evaluations",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(interview.router)
app.include_router(speech.router)
app.include_router(vision.router)
app.include_router(report.router)

@app.get("/")
async def root():
    return {"message": "AI-Powered Multimodal Interview Preparation API online. View /docs for routes."}
