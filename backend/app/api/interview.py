from fastapi import APIRouter
from app.services.llm.question_generator import QuestionGenerator
from app.services.rag.retriever import ContextRetriever

router = APIRouter(prefix="/interview", tags=["interview"])

@router.post("/questions")
async def get_questions(data: dict):
    job_title = data.get("job_title", "Software Developer")
    # Using RAG to retrieve matching context first
    rag_questions = ContextRetriever.retrieve_similar_questions(job_title, limit=2)
    
    # Generate tailored questions via Gemini
    generated = QuestionGenerator.generate_questions(job_title, rag_questions)
    return generated
