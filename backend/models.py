# backend/models.py

from pydantic import BaseModel
from typing import List, Optional

class User(BaseModel):
    name: str
    email: str
    skills: List[str]
    interests: List[str]
    idea: Optional[str] = None

class Team(BaseModel):
    name: str
    members: List[str]

class Task(BaseModel):
    title: str
    assignee: str
    status: Optional[str] = "To-Do"

class ProfileUpdate(BaseModel):
    # Used for PUT /profile/update
    email: str
    github_link: Optional[str] = None
    linkedin_link: Optional[str] = None
    extracted_text: Optional[str] = None