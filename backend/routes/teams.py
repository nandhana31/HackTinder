# routes/teams.py (CORRECTED)

from fastapi import APIRouter
from ..models import Team
from ..agentuity_api import generate_tasks
# Import the functions, NOT the collections
from ..db_config import create_team, insert_tasks

router = APIRouter()

@router.post("/createTeam")
def create_team_and_tasks(team: Team):
    team_data = team.dict()
    member_emails = team.members
    
    # Use dedicated function: creates team AND updates users
    team_id = create_team(team_data, member_emails)
    
    # Generate tasks (mocked or real)
    # Note: You need to retrieve member data to pass to generate_tasks 
    # for smart assignment, but for now we pass only the emails.
    task_data = generate_tasks(team_data["name"], team.members) 
    
    # Use dedicated function to insert tasks
    # NOTE: The generate_tasks in agentuity.py needs the team_id to be added to the tasks
    for task in task_data.get("tasks", []):
        task["team_id"] = team_id

    inserted_ids = insert_tasks(task_data.get("tasks", []))
    
    return {
        "message": "Team created and tasks assigned!", 
        "team_id": team_id,
        "tasks_inserted": len(inserted_ids)
    }
