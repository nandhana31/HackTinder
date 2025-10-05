import os
import requests
from dotenv import load_dotenv
import json
import re 

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def extract_json_from_text(text: str) -> str:
    """Safely extracts a JSON string from text, ignoring markdown and commentary."""
    # 1. Regex to find and capture the contents of a JSON block ({...})
    # Look for the outermost braces { ... }
    match = re.search(r'\{[\s\S]*?\}', text)
    if match:
        return match.group(0).strip()
    
    # 2. If no structure is found, return the original text 
    return text

def generate_match_score(user1, user2):
    # Convert Pydantic models (or dicts) to JSON strings for a clean prompt
    user1_str = json.dumps(user1)
    user2_str = json.dumps(user2)

    # COMBINED PROMPT/SYSTEM INSTRUCTION for better control:
    combined_instruction = (
        "You are a specialized AI for scoring user compatibility. "
        "Your ONLY task is to compare the skills and interests of the two users below and provide a match percentage (0-100) and a brief explanation. "
        "Your ONLY output must be a single, complete, valid JSON object with the fields 'match_score' (integer) and 'reason' (string). "
        "DO NOT include any markdown, preamble, or other commentary in your output.\n\n"
        f"User 1: {user1_str}\nUser 2: {user2_str}"
    )
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    
    # CORRECTED PAYLOAD STRUCTURE
    payload = {
        # FIX: The system instruction content is now included here as the main text prompt
        "contents": [
            {
                "parts": [{"text": combined_instruction}] 
            }
        ]
        # We removed the separate "systemInstruction" key that caused the 400 error
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        
        # --- FIX #1: Check for HTTP errors before JSON parsing ---
        if response.status_code != 200:
            # Attempt to extract error details if the response is JSON
            try:
                # The Gemini API returns a predictable error structure
                error_detail = response.json().get('error', {}).get('message', 'No detail provided.')
            except:
                error_detail = f"Unknown API Error ({response.status_code})."
            
            # Use the status code for clear reporting
            response.raise_for_status() 

        # If we reach here, status code is 200 
        raw_output = response.json()['candidates'][0]['content']['parts'][0]['text']
        
        # --- FIX #2: Use the extraction function before parsing ---
        clean_json_str = extract_json_from_text(raw_output)
        
        # Parse the cleaned JSON string
        match_data = json.loads(clean_json_str)
        
        return {
            "match_score": match_data.get("match_score", 0),
            "reason": match_data.get("reason", "AI match engine provided no explanation.")
        }
    
    except requests.exceptions.HTTPError as http_err:
        # Report specific API HTTP errors (like 403, 429) clearly
        return {
            "match_score": 0,
            "reason": f"API Error: Status {http_err.response.status_code}. Detail: {http_err.response.text[:100]}..."
        }
    except Exception as e:
        # This catches JSONDecodeError (if cleaning failed) or other network errors
        reason = f"Internal Error: Failed to decode response. Raw output likely invalid JSON. Error: {e.__class__.__name__}"
        print(f"Error in Gemini Matchmaking: {e}")
        try:
             # This will print the raw text, which is useful if the error is JSONDecodeError
             print(f"Problematic Output: {raw_output}")
        except NameError:
             pass 
             
        return {
            "match_score": 0,
            "reason": reason
        }
