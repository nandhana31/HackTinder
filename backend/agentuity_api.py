import os
import requests
from dotenv import load_dotenv
from typing import List, Dict, Any

# Load environment variables (MONGO_URI, etc.) for other modules that might use this file
load_dotenv()

# --- IMPORTANT CONFIGURATION ---
# This is the unique Webhook URL provided by Agentuity for your deployed Agent.
# Your FastAPI /createTeam endpoint will POST data to this URL.
AGENTUITY_WEBHOOK_URL = "https://agentuity.ai/webhook/4fc66228585bab217224f7f96bb4d358"

# Define the core hackathon tasks and the required skills for assignment
CORE_TASKS = {
    # Task Title: [Required Skills (keywords)]
    "Idea Validation & Scope": ["idea", "analysis", "business", "pitch"],
    "Frontend UI/UX Design": ["react", "ui/ux", "design", "css", "html"],
    "Backend API Development": ["python", "fastapi", "backend", "api"],
    "Database Schema Setup": ["mongodb", "database", "data"],
    "Pitch Deck & Presentation": ["presentation", "communication", "pitch", "marketing"]
}

def find_best_assignee(task_skills: List[str], members_data: List[Dict]) -> str:
    """
    Finds the best team member to assign a task to by comparing required task skills 
    against each member's skills (simple score matching).
    """
    best_match_score = -1
    best_assignee = "Unassigned"
    
    if not members_data:
        return "Unassigned"

    # Iterate through members to find the best skill match
    for member in members_data:
        member_name = member.get("name", "Unknown Member")
        # Ensure we check skills, defaulting to an empty list if not present
        member_skills = [s.lower() for s in member.get("skills", [])]
        
        match_score = 0
        for skill in task_skills:
            if skill.lower() in member_skills:
                match_score += 1
        
        if match_score > best_match_score:
            best_match_score = match_score
            best_assignee = member_name
            
    # Fallback to the first team member if no relevant skills were found (score remains 0)
    if best_match_score == 0:
        return members_data[0].get("name", "Team Lead")
        
    return best_assignee

def generate_tasks(team_name: str, members_data: List[Dict]) -> Dict[str, Any]:
    """
    Generates a list of tasks, assigns them, sends the payload to Agentuity, 
    and returns the tasks for local MongoDB storage.
    """
    print(f"Starting task generation for team: {team_name}")

    generated_tasks = []
    
    # 1. Generate tasks and assign them intelligently
    for title, required_skills in CORE_TASKS.items():
        assignee = find_best_assignee(required_skills, members_data)
        
        # Create the task dictionary for local storage
        generated_tasks.append({
            "title": title,
            "assignee": assignee,
            "status": "To-Do" # Initial status for MongoDB
        })
    
    # 2. Construct the payload for the Agentuity Webhook
    # The Agentuity agent needs the full context to create the board on its end.
    agentuity_payload = {
        "team_name": team_name,
        "team_members": members_data, # Send full member data for agent to use
        "tasks_to_create": generated_tasks, # Send the assigned tasks
    }

    # 3. Trigger the deployed Agentuity Agent via the Webhook
    headers = {"Content-Type": "application/json"}
    
    # NOTE: The project secret key added to GitHub is NOT needed here. 
    # That key is used by the Agentuity CLI for deployment/authentication 
    # on their platform, not for calling the public webhook.
    
    try:
        response = requests.post(AGENTUITY_WEBHOOK_URL, json=agentuity_payload, headers=headers)
        response.raise_for_status() 
        print(f"SUCCESS: Agentuity Agent triggered. Status: {response.status_code}")
        
        # Optionally, return Agentuity's response if it confirms board creation
        return_message = response.json().get("message", "Tasks sent to Agentuity successfully.")
        
    except requests.exceptions.RequestException as e:
        # Handle network or connection errors
        print(f"ERROR: Agentuity Webhook failed to connect/respond. Error: {e}")
        return_message = "Agentuity connection failed. Tasks saved locally only."
    
    # 4. Return the generated tasks for saving to MongoDB in teams.py
    # We return the locally generated tasks regardless of the webhook success 
    # so the team still has tasks in MongoDB.
    return {
        "tasks": generated_tasks,
        "agentuity_status": return_message
    }
