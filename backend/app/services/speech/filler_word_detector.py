import re

class FillerWordDetector:
    @staticmethod
    def detect(text: str) -> dict:
        fillers = ["um", "uh", "ah", "like", "you know", "basically", "so"]
        results = {}
        for word in fillers:
            # regex word boundaries
            pattern = rf"\b{word}\b"
            count = len(re.findall(pattern, text, re.IGNORECASE))
            if count > 0:
                results[word] = count
        return results
