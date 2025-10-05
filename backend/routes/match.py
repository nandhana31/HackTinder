# routes/match.py (FIXED)

from fastapi import APIRouter
<<<<<<< HEAD
# Fix: Direct imports for AI and DB functions
from backend.gemini_api import generate_match_score 
from backend.db_config import find_user_by_email, find_all_match_candidates 
=======

from ..gemini_api import generate_match_score
# Import the functions, NOT the collections
from ..db_config import find_user_by_email, find_all_match_candidates 
>>>>>>> 509e04c740f6b0003c6530bc623aa80f9568d372

router = APIRouter()

@router.get("/match/{email}")
def find_best_matches(email: str):
    # Use dedicated DB functions
    user = find_user_by_email(email)
    if not user:
        return {"error": "User not found."}
        
    # Find candidates using the dedicated function
    others = find_all_match_candidates(email)
    
    results = []
    for o in others:
        match = generate_match_score(user, o)
        results.append({"partner": o["name"], **match})
    
    sorted_results = sorted(results, key=lambda x: x["match_score"], reverse=True)
    return {"matches": sorted_results[:3]}
