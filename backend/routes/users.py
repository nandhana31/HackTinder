from fastapi import APIRouter
from models import User
from backend.db_config import users_col

router = APIRouter()

@router.post("/register")
def register_user(user: User):
    users_col.insert_one(user.dict())
    return {"message": "User registered successfully!"}

@router.get("/users")
def get_all_users():
    users = list(users_col.find({}, {"_id": 0}))
    return {"users": users}
