import os
import requests

def generate_tasks(team_name, members):
    api_key = os.getenv("AGENTUITY_API_KEY")
    url = "https://api.agentuity.com/createTasks"

    payload = {
        "team_name": team_name,
        "members": members,
        "default_tasks": [
            {"title": "Brainstorm idea", "assignee": members[0]},
            {"title": "Frontend setup", "assignee": members[1]},
            {"title": "Backend API setup", "assignee": members[2] if len(members) > 2 else members[0]}
        ]
    }

    headers = {"Authorization": f"Bearer {api_key}"}
    response = requests.post(url, json=payload, headers=headers)

    return response.json() if response.status_code == 200 else {"error": "Agentuity API failed"}
