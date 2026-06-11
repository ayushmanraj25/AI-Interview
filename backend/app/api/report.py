import os
import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.services.llm.gemini_service import gemini_service
from app.services.llm import prompts
from app.services.reports.pdf_generator import PDFReportGenerator
from app.supabase.queries import save_interview_report

router = APIRouter(prefix="/report", tags=["report"])

REPORTS_DIR = "../uploads/reports"
os.makedirs(REPORTS_DIR, exist_ok=True)

@router.post("/generate")
async def generate_report(data: dict):
    answers = data.get("answers", [])
    answers_json = json.dumps(answers, indent=2)
    
    prompt = prompts.REPORT_GENERATION_PROMPT.format(answers_json=answers_json)
    fallback = {
        "overall_score": 82,
        "technical_score": 85,
        "communication_score": 80,
        "body_language_score": 82,
        "feedback": "Good answers. Keep polishing technical concepts and reduce speaking pace."
    }
    
    report_scores = gemini_service.generate_json(prompt, fallback)
    report_scores["id"] = data.get("session_id", "session-xyz")
    report_scores["question_breakdown"] = [
        {
            "question": ans.get("question", "Tech Question"),
            "score": ans.get("confidence_score", 85),
            "feedback": "Detailed response demonstrating knowledge."
        } for ans in answers
    ]
    
    # Generate Report PDF
    pdf_path = os.path.join(REPORTS_DIR, f"report_{report_scores['id']}.pdf")
    PDFReportGenerator.generate(pdf_path, report_scores)
    
    # Save to Supabase
    save_interview_report(report_scores)
    
    return report_scores

@router.get("/{report_id}")
async def get_report(report_id: str):
    pdf_path = os.path.join(REPORTS_DIR, f"report_{report_id}.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="Report PDF not generated yet")
        
    return {
        "id": report_id,
        "status": "available",
        "pdf_url": f"/api/report/{report_id}/download"
    }

@router.get("/{report_id}/download")
async def download_report(report_id: str):
    pdf_path = os.path.join(REPORTS_DIR, f"report_{report_id}.pdf")
    if not os.path.exists(pdf_path):
         raise HTTPException(status_code=404, detail="PDF file not found")
    return FileResponse(pdf_path, media_type="application/pdf", filename=f"AI_Interview_Report_{report_id}.pdf")
