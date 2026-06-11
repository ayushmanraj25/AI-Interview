class RecommendationEngine:
    @staticmethod
    def get_roadmap(skills: list, weaknesses: str) -> list:
        return [
            f"Review standard technical patterns around: {', '.join(skills[:3])}.",
            "Practice mock speaking sessions without filler words to improve communication flow."
        ]
