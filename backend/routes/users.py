# routes/users.py (FIXED)

from fastapi import APIRouter
from models import User
# Import the functions, NOT the collections
from db_config import insert_user, find_all_users
from backend.db_config import users_col

router = APIRouter()

@router.post("/register")
def register_user(user: User):
    # Use your defined function
    user_id = insert_user(user.dict())
    return {"message": "User registered successfully!", "user_id": user_id}

@router.get("/users")
def get_all_users():
    # Use your defined function
    users = find_all_users()
    return {"users": users}
