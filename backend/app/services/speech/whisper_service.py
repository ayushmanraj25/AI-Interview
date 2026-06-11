import os
import google.generativeai as genai
from app.services.llm.gemini_service import gemini_service

class WhisperService:
    @staticmethod
    def transcribe(audio_file_path: str) -> str:
        if not os.path.exists(audio_file_path):
            return "File not found"
            
        if not gemini_service.enabled:
            return "Mock transcribed candidate answer for the interview evaluation."
            
        try:
            # Ingest raw audio payload directly using multimodal Gemini
            audio_file = genai.upload_file(path=audio_file_path)
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content([
                "Transcribe this audio file accurately. Do not add comments or annotations.",
                audio_file
            ])
            return response.text.strip()
        except Exception as e:
            print("Gemini transcription failed, serving fallback text:", str(e))
            return "This is a mock answer since audio transcription failed locally."
