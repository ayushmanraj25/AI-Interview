import os
import chromadb
from app.services.rag.embeddings import EmbeddingGenerator

class ChromaStore:
    def __init__(self, path: str = "../vector_db/chroma_db"):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        self.client = chromadb.PersistentClient(path=path)
        
    def get_collection(self, name: str = "interview_questions"):
        class GeminiEmbeddingFunction:
            @staticmethod
            def name() -> str:
                return "GeminiEmbeddingFunction"
            def __call__(self, input):
                return [EmbeddingGenerator.embed_text(txt) for txt in input]
                
        return self.client.get_or_create_collection(
            name=name,
            embedding_function=GeminiEmbeddingFunction()
        )

chroma_store = ChromaStore()

# Seed ChromaDB with base questions if empty
try:
    collection = chroma_store.get_collection()
    if collection.count() == 0:
        base_questions = [
            "Explain the virtual DOM concept in React and how it improves rendering performance.",
            "What is CORS, and how do you resolve CORS errors in a fullstack application?",
            "Describe a complex technical challenge you faced and how you debugged and solved it.",
            "How do you optimize a page's Largest Contentful Paint (LCP) performance?",
            "What is RAG (Retrieval-Augmented Generation) and how does it optimize LLM prompt contexts?",
            "Explain standard database scaling and caching strategies.",
            "Describe the difference between asynchronous FastAPI routes and standard blocking routers."
        ]
        collection.add(
            documents=base_questions,
            ids=[f"q-{i}" for i in range(len(base_questions))],
            metadatas=[{"category": "tech"} for _ in base_questions]
        )
        print("ChromaDB seeded successfully!")
except Exception as e:
    print("Warning: ChromaDB initialization error:", str(e))
