from fastapi import APIRouter
from backend.gemini_api import generate_match_score 
from backend.db_config import find_user_by_email, find_all_match_candidates 
from backend.db_config import users_col # Direct import for temporary structure access

router = APIRouter()

@router.get("/match/{email}")
def find_best_matches(email: str):
    # 1. Fetch the requesting user's profile
    user = users_col.find_one({"email": email})
    
    if not user:
        return {"error": "User not found."}, 404
        
    # Remove MongoDB's internal ID for cleaner output
    user.pop('_id', None)

    # 2. Find all candidates to match against
    # This finds all users EXCEPT the requesting user
    others = list(users_col.find({"email": {"$ne": email}}, {"_id": 0}))
    
    results = []
    
    for o in others:
        # 3. Call Gemini to get the score and reason
        # We pass the cleaned dictionary objects to the API function
        match_data = generate_match_score(user, o)
        
        # 4. Construct the final result payload
        # Combine the partner's full profile (o) with the match score and reason.
        # This ensures the frontend gets SKILLS, INTERESTS, and NAME in one object.
        match_result = {
            "partner_profile": o,  # Contains name, email, skills, interests
            "match_score": match_data.get("match_score", 0),
            "reason": match_data.get("reason", "AI match explanation not available.")
        }
        results.append(match_result)
    
    # 5. Sort the results and return the top 3
    sorted_results = sorted(results, key=lambda x: x["match_score"], reverse=True)
    
    # Structure the final response to match expected frontend structure (top-level 'matches' key)
    return {"matches": sorted_results[:3]}
