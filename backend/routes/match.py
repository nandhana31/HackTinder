from fastapi import APIRouter
from backend.db_config import users_col
from gemini_api import generate_match_score

router = APIRouter()

@router.get("/match/{email}")
def find_best_matches(email: str):
    user = users_col.find_one({"email": email}, {"_id": 0})
    others = list(users_col.find({"email": {"$ne": email}}, {"_id": 0}))
    
    results = []
    for o in others:
        match = generate_match_score(user, o)
        results.append({"partner": o["name"], **match})
    
    sorted_results = sorted(results, key=lambda x: x["match_score"], reverse=True)
    return {"matches": sorted_results[:3]}
