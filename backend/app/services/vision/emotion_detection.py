class EmotionDetector:
    @staticmethod
    def analyze(image_path: str = None) -> dict:
        return {
            "confident": 0.80,
            "calm": 0.15,
            "anxious": 0.05
        }
