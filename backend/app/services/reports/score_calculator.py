class ScoreCalculator:
    @staticmethod
    def compute(technical_score: int, communication_score: int, body_language_score: int) -> int:
        return int((technical_score + communication_score + body_language_score) / 3)
