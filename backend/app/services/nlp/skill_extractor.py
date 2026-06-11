from app.services.llm.gemini_service import gemini_service
from app.services.llm import prompts

class SkillExtractor:
    @staticmethod
    def extract(resume_text: str) -> dict:
        prompt = prompts.SKILL_EXTRACTION_PROMPT.format(resume_text=resume_text)
        fallback = {
            "skills": ["Communication", "General Technical Development"],
            "experience_years": 1.0,
            "education": "Unknown",
            "suggested_roles": ["Developer"]
        }
        return gemini_service.generate_json(prompt, fallback)
