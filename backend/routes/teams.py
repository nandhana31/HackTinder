# routes/teams.py (FINAL, CLEANED VERSION)

from fastapi import APIRouter
from models import Team # Direct import
from agentuity_api import generate_tasks # Direct import of Agentuity logic
from db_config import create_team, insert_tasks # Direct import of DB transactional functions

router = APIRouter()

@router.post("/createTeam")
def create_team_and_tasks(team: Team):
    """Creates a team, updates user documents, and triggers task generation."""
    team_data = team.dict()
    member_emails = team.members
    
    # 1. Use dedicated function: creates team document AND updates user documents
    team_id = create_team(team_data, member_emails)
    
    # 2. Generate tasks (calls Agentuity logic)
    # NOTE: You would fetch member skills here for optimal assignment
    task_data = generate_tasks(team_data["name"], team.members) 
    
    # 3. Add team_id to tasks and save them locally
    for task in task_data.get("tasks", []):
        task["team_id"] = team_id

    inserted_ids = insert_tasks(task_data.get("tasks", []))
    
    return {
        "message": "Team created and tasks assigned!", 
        "team_id": team_id,
        "tasks_inserted": len(inserted_ids),
        "agentuity_status": task_data.get("agentuity_status", "Success (Mock/Webook Triggered)")
    }