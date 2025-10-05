# routes/match.py (FINAL, CLEANED VERSION)

from fastapi import APIRouter
# Fix: Direct imports for AI and DB functions
from backend.gemini_api import generate_match_score 
from backend.db_config import find_user_by_email, find_all_match_candidates 

router = APIRouter()

@router.get("/match/{email}")
def find_best_matches(email: str):
    """
    Finds the best potential teammates for the user based on skills and rich profile data.
    """
    # 1. Get the current user's full, rich profile data
    user = find_user_by_email(email)
    if not user:
        return {"error": "User not found."}
        
    # 2. Find all eligible users (not already teamed)
    others = find_all_match_candidates(email)
    
    results = []
    for o in others:
        # 3. Pass full user documents to Gemini logic for complex scoring
        match = generate_match_score(user, o)
        results.append({
            "partner": o.get("name", "Unknown"), 
            "partner_email": o.get("email", ""),
            **match
        })
    
    # 4. Sort and return the top 3 matches
    sorted_results = sorted(results, key=lambda x: x["match_score"], reverse=True)
    return {"matches": sorted_results[:3]}