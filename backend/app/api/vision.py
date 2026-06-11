import os
from fastapi import APIRouter, UploadFile, File
from app.services.vision.posture_analysis import PostureAnalyzer
from app.services.vision.eye_contact import EyeContactTracker
from app.services.vision.emotion_detection import EmotionDetector

router = APIRouter(prefix="/vision", tags=["vision"])

VIDEO_UPLOADS = "../uploads/video"
os.makedirs(VIDEO_UPLOADS, exist_ok=True)

@router.post("/analyze")
async def analyze_frame(video: UploadFile = File(...)):
    file_path = os.path.join(VIDEO_UPLOADS, video.filename)
    with open(file_path, "wb") as f:
        f.write(await video.read())
        
    posture = PostureAnalyzer.analyze(file_path)
    eye_contact = EyeContactTracker.analyze(file_path)
    emotions = EmotionDetector.analyze(file_path)
    
    return {
        "eye_contact_ratio": eye_contact,
        "posture_deviation": posture,
        "emotions": emotions,
        "confidence_score": 88
    }
