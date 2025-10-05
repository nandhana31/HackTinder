from fastapi import APIRouter, File, UploadFile, Form 
from typing import Optional

from backend.models import User, ProfileUpdate 
from backend.db_config import insert_user, find_all_users, update_user_profile_data 
from backend.gemini_api import analyze_and_extract_skills 

router = APIRouter()  # No prefix here

@router.post("/register")
def register_user(user: User):
    """Registers a new user and saves their core profile to the database."""
    user_id = insert_user(user.dict())
    return {"message": "User registered successfully!", "user_id": user_id}

@router.get("/users")
def get_all_users():
    """Retrieves all registered users for viewing/debugging."""
    users = find_all_users()
    return {"users": users}

@router.put("/profile/update")
def update_user_profile(
    email: str = Form(...),
    github_link: str | None = Form(None),
    linkedin_link: str | None = Form(None),
    resume_file: UploadFile | None = File(None)
):
    """Updates user profile with links and resume."""
    
    extracted_text = None
    if resume_file:
        try:
            file_contents = resume_file.file.read(2000).decode('utf-8', errors='ignore')
            extracted_text = f"Resume Content: {file_contents}..." 
        except Exception as e:
            extracted_text = f"Could not read resume file content. Error: {e}"

    raw_profile_data = {
        "github_link": github_link,
        "linkedin_link": linkedin_link,
        "resume_text": extracted_text,
    }
    
    ai_analysis = analyze_and_extract_skills(raw_profile_data)
    
    update_payload = {
        'skills': ai_analysis.get('extracted_skills', ["Analysis Failed"]),
        'analysis_summary': ai_analysis.get('summary', "Analysis unavailable"),
        'github_link': github_link,
        'linkedin_link': linkedin_link,
        'resume_status': 'Processed' if resume_file else 'No file provided', 
    }
    
    success = update_user_profile_data(email, update_payload)
    
    if success:
        return {"message": "Profile analyzed and updated successfully!"}
    else:
        return {"message": "User not found or update failed."}