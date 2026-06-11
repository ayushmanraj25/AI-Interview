import os
from fastapi import APIRouter, UploadFile, File
from app.services.nlp.resume_parser import ResumeParser
from app.services.nlp.skill_extractor import SkillExtractor

router = APIRouter(prefix="/resume", tags=["resume"])

UPLOADS_DIR = "../uploads/resumes"
os.makedirs(UPLOADS_DIR, exist_ok=True)

@router.post("/analyze")
async def upload_resume(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOADS_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
        
    text = ResumeParser.extract_text(file_path)
    skills_data = SkillExtractor.extract(text)
    return {
        "filename": file.filename,
        "skills": skills_data.get("skills", []),
        "experience_years": skills_data.get("experience_years", 0),
        "education": skills_data.get("education", "Unknown"),
        "suggested_roles": skills_data.get("suggested_roles", [])
    }
