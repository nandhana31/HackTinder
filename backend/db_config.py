from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client["HackMateAI"]

users_col = db["users"]
teams_col = db["teams"]
tasks_col = db["tasks"]
