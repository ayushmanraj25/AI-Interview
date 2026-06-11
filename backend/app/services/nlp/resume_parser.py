import os
from pypdf import PdfReader

class ResumeParser:
    @staticmethod
    def extract_text(file_path: str) -> str:
        if not os.path.exists(file_path):
            return ""
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text.strip()
        except Exception as e:
            print("Error parsing PDF:", str(e))
            return ""
