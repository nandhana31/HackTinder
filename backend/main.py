from fastapi import FastAPI
from .routes import users, match, teams

app = FastAPI(title="HackMateAI Backend")

app.include_router(users.router)
app.include_router(match.router)
app.include_router(teams.router)

@app.get("/")
def root():
    return {"message": "HackMateAI Backend Running 🚀"}
