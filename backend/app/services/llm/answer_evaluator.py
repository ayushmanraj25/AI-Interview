from app.services.llm.gemini_service import gemini_service
from app.services.llm import prompts

class AnswerEvaluator:
    @staticmethod
    def evaluate(question: str, response: str) -> dict:
        prompt = prompts.ANSWER_EVALUATION_PROMPT.format(
            question=question,
            response=response
        )
        fallback = {
            "score": 80,
            "feedback": "The answer covers core points but could benefit from deeper technical detail.",
            "suggestions": "Try adding specific lifecycle details or architecture examples in your answer."
        }
        return gemini_service.generate_json(prompt, fallback)
