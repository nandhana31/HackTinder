import os
import requests
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def generate_match_score(user1, user2):
    prompt = (
        f"Compare skills and interests of {user1} and {user2}. "
        "Provide a match percentage and a brief explanation in JSON format. "
        "Example: {'match_score': 87, 'reason': 'Both are skilled in Python and AI.'}\n\n"
        f"Users:\nUser1: {user1}\nUser2: {user2}"
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        raw_output = response.json()['candidates'][0]['content']['parts'][0]['text']
        
        # Parse the JSON string from the response.
        # This is a critical step and will require careful handling
        # to ensure the output is always a valid JSON.
        import json
        match_data = json.loads(raw_output)
        
        return {
            "match_score": match_data.get("match_score"),
            "reason": match_data.get("reason")
        }
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return {
            "match_score": 0,
            "reason": "An error occurred during matchmaking."
        }