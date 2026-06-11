from app.services.rag.chroma_store import chroma_store

class ContextRetriever:
    @staticmethod
    def retrieve_similar_questions(query: str, limit: int = 3) -> list:
        try:
            collection = chroma_store.get_collection()
            results = collection.query(
                query_texts=[query],
                n_results=limit
            )
            # Return list of text questions
            if results and results.get("documents"):
                return results["documents"][0]
        except Exception as e:
            print("Retrieval failed:", str(e))
        return []
