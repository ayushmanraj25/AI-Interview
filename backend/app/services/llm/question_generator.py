from app.services.llm.gemini_service import gemini_service
from app.services.llm import prompts

class QuestionGenerator:
    @staticmethod
    def generate_questions(job_title: str, skills: list, num_questions: int = 4) -> list:
        prompt = prompts.QUESTION_GENERATION_PROMPT.format(
            job_title=job_title,
            skills=", ".join(skills),
            num_questions=num_questions
        )
        fallback = [
            {"id": 1, "text": f"Explain key architectural concepts in {job_title} development."},
            {"id": 2, "text": "Describe your workflow when debugging performance bottlenecks."},
            {"id": 3, "text": "How do you handle team disagreements regarding technical implementation choices?"},
            {"id": 4, "text": "Explain standard security practices to safeguard web applications."}
        ]
        res = gemini_service.generate_json(prompt, {"questions": fallback})
        return res.get("questions", fallback)
