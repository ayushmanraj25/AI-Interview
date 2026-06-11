import os
from fastapi import APIRouter, UploadFile, File
from app.services.speech.whisper_service import WhisperService
from app.services.speech.filler_word_detector import FillerWordDetector
from app.services.speech.speech_analyzer import SpeechAnalyzer

router = APIRouter(prefix="/speech", tags=["speech"])

AUDIO_UPLOADS = "../uploads/audio"
os.makedirs(AUDIO_UPLOADS, exist_ok=True)

@router.post("/transcribe")
async def transcribe_speech(audio: UploadFile = File(...)):
    file_path = os.path.join(AUDIO_UPLOADS, audio.filename)
    with open(file_path, "wb") as f:
        f.write(await audio.read())
        
    text = WhisperService.transcribe(file_path)
    fillers = FillerWordDetector.detect(text)
    metrics = SpeechAnalyzer.analyze_delivery(text, duration_seconds=15)
    
    return {
        "text": text,
        "filler_words": fillers,
        "speech_rate": metrics["words_per_minute"],
        "confidence_score": 90 if len(fillers) < 3 else 75
    }
