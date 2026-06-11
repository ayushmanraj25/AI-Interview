from app.services.llm.gemini_service import gemini_service

class EmbeddingGenerator:
    @staticmethod
    def embed_text(text: str) -> list:
        return gemini_service.generate_embeddings(text)
