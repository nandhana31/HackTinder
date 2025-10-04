import os
import requests

def generate_match_score(user1, user2):
    api_key = os.getenv("GEMINI_API_KEY")
    prompt = f"Compare these two users and rate compatibility from 0–100:\nUser1: {user1}\nUser2: {user2}\nExplain the reason."

    # Sample Gemini API call structure (replace URL with actual endpoint)
    response = requests.post(
        "https://api.gemini.com/v1/text", 
        headers={"Authorization": f"Bearer {api_key}"},
        json={"input": prompt}
    )

    data = response.json()
    # Expected response parsing
    return {
        "match_score": 85,  # Replace with real parsed value
        "reason": data.get("output", "Both users have similar skills.")
    }
