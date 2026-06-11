class SpeechAnalyzer:
    @staticmethod
    def analyze_delivery(text: str, duration_seconds: float = 30) -> dict:
        # Speaking rate
        words = len(text.split())
        words_per_minute = 0
        if duration_seconds > 0:
            words_per_minute = int((words / duration_seconds) * 60)
            
        # Target pacing: 120 - 150 words per minute is standard
        pacing = "normal"
        if words_per_minute < 100: pacing = "slow"
        elif words_per_minute > 160: pacing = "fast"
        
        return {
            "word_count": words,
            "duration_seconds": duration_seconds,
            "words_per_minute": words_per_minute,
            "pacing": pacing
        }
