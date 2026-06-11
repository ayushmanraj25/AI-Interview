import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY", "")
        self.enabled = bool(self.api_key)
        if self.enabled:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            self.emb_model = 'models/embedding-001'
        else:
            print("Warning: GEMINI_API_KEY is missing. AI evaluations will be simulated.")

    def generate_content(self, prompt: str) -> str:
        if not self.enabled:
            return ""
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print("Gemini generate exception:", str(e))
            return ""

    def generate_json(self, prompt: str, fallback_data: dict) -> dict:
        if not self.enabled:
            return fallback_data
        try:
            # Force JSON mode
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            print("Gemini JSON generation failed, parsing text manually:", str(e))
            text = self.generate_content(prompt)
            # Find JSON block
            try:
                start = text.find("{")
                end = text.rfind("}") + 1
                if start != -1 and end != -1:
                    return json.loads(text[start:end])
            except:
                pass
            return fallback_data

    def generate_embeddings(self, text: str) -> list:
        if not self.enabled:
            # Return dummy mock embedding
            return [0.1] * 768
        try:
            result = genai.embed_content(
                model=self.emb_model,
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            print("Embedding generation failed:", str(e))
            return [0.0] * 768

gemini_service = GeminiService()
