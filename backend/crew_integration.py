"""Multi-agent crew integration for CodeKids"""
from crew import teach_coding_concept

def handle_teaching_crew(concept: str, language: str = "Python") -> dict:
    """Handle multi-agent crew request for code teaching"""
    try:
        result = teach_coding_concept(concept, language)
        return {
            "status": "success",
            "lesson": result["lesson"],
            "exercises": result["exercises"],
            "concept": concept,
            "language": language,
            "agents_used": ["teacher", "mentor"]
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "agents_used": []
        }
