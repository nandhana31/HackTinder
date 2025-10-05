# routes/teams.py

from fastapi import APIRouter, HTTPException
from backend.models import Team
from backend.agentuity_api import generate_tasks
from backend.db_config import create_team, insert_tasks, users_col

router = APIRouter()


def auto_generate_tasks(team_name: str, members_data: list):
    """Generate tasks for each team member based on their skills."""
    skill_tasks = {
        "backend": ["Design database schema", "Implement API endpoints", "Integrate authentication", "Write unit tests"],
        "frontend": ["Design landing page", "Build React components", "Style with CSS/SCSS", "Improve UX flow"],
        "ml": ["Collect and preprocess data", "Train model", "Evaluate model", "Deploy ML pipeline"],
        "devops": ["Create CI/CD pipeline", "Setup Docker containers", "Configure AWS deployment", "Monitor logs"]
    }

    all_tasks = []

    for member in members_data:
        member_tasks = []
        name = member.get("name", "Unknown Member")
        skills = [s.lower() for s in member.get("skills", [])]

        # Assign based on skill keywords
        if any(skill in skills for skill in ["python", "fastapi", "database", "backend"]):
            member_tasks.extend(skill_tasks["backend"])
        if any(skill in skills for skill in ["react", "css", "ui/ux", "design", "frontend"]):
            member_tasks.extend(skill_tasks["frontend"])
        if any(skill in skills for skill in ["ml", "machine learning", "ai", "data", "nlp"]):
            member_tasks.extend(skill_tasks["ml"])
        if any(skill in skills for skill in ["devops", "docker", "aws", "deployment"]):
            member_tasks.extend(skill_tasks["devops"])

        # Default fallback if no skills matched
        if not member_tasks:
            member_tasks.append("Assist team with documentation and testing")

        # Build task objects
        for task in member_tasks:
            all_tasks.append({
                "team_name": team_name,
                "assigned_to": name,
                "email": member.get("email"),
                "task": task,
                "status": "pending"
            })

    return all_tasks


@router.post("/createTeam")
def create_team_and_tasks(team: Team):
    """Creates a team, updates user documents, and triggers task generation."""
    team_data = team.dict()
    member_emails = team.members

    # 1️⃣ Fetch full user info
    members_data = list(users_col.find({"email": {"$in": member_emails}}, {"_id": 0}))
    if not members_data:
        raise HTTPException(status_code=400, detail="No user data found for the provided emails.")

    # 2️⃣ Create team in DB (this also updates user documents with team_id)
    team_id = create_team(team_data, member_emails)

    # 3️⃣ Generate tasks automatically based on member skills
    tasks = auto_generate_tasks(team_data["name"], members_data)

    # 4️⃣ Add team_id to tasks and insert into DB
    for t in tasks:
        t["team_id"] = team_id

    inserted_ids = insert_tasks(tasks)

    # 5️⃣ Optionally trigger Agentuity (best-effort; don't fail the route if it errors)
    agentuity_status = None
    try:
        task_data = generate_tasks(team_data["name"], team.members)
        agentuity_status = task_data.get("agentuity_status", "Triggered") if isinstance(task_data, dict) else "Triggered"
    except Exception:
        agentuity_status = "Agentuity call failed or not configured"

    # Build task distribution per member for the response
    task_distribution = {m.get("name", m.get("email")): [t["task"] for t in tasks if t.get("email") == m.get("email")] for m in members_data}

    return {
        "message": "✅ Team created and tasks auto-assigned based on skills!",
        "team_id": team_id,
        "tasks_inserted": len(inserted_ids),
        "total_tasks": len(tasks),
        "task_distribution": task_distribution,
        "agentuity_status": agentuity_status,
    }
