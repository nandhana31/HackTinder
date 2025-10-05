from fastapi import FastAPI
<<<<<<< HEAD
from .routes import users, match, teams
=======
from routes import users, match, teams
>>>>>>> e503f531cc84c0aa272949dba7bdf6907289c7b8

app = FastAPI(title="HackMateAI Backend")

app.include_router(users.router)
app.include_router(match.router)
app.include_router(teams.router)

@app.get("/")
def root():
    return {"message": "HackMateAI Backend Running"}