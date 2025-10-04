# agentuity_api.py (NEW FILE)

from typing import List, Dict

def generate_tasks(team_id: str, team_name: str, members: List[str]) -> Dict:
    """MOCKED FUNCTION: Returns dummy tasks for database insertion test."""
    assignee = members[0] if members else "Unassigned"
    
    return {
        "tasks": [
            {"title": "Front-End Setup", "assignee": assignee, "team_id": team_id, "status": "To-Do"},
            {"title": "Review Gemini Match Logic", "assignee": assignee, "team_id": team_id, "status": "To-Do"},
            {"title": "Initial Pitch Deck Outline", "assignee": assignee, "team_id": team_id, "status": "To-Do"}
        ]
    }