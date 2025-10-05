from fastapi import APIRouter
from models import Team
from backend.db_config import teams_col, tasks_col
from agentuity_api import generate_tasks

router = APIRouter()

@router.post("/createTeam")
def create_team(team: Team):
    teams_col.insert_one(team.dict())
    task_data = generate_tasks(team.name, team.members)
    tasks_col.insert_many(task_data.get("tasks", []))
    return {"message": "Team created and tasks assigned!", "tasks": task_data}
