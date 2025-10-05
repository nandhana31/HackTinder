from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import users, match, teams

app = FastAPI(title="HackMateAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Don't add prefixes here
app.include_router(users.router)
app.include_router(match.router)
app.include_router(teams.router)

@app.get("/")
def root():
    return {"message": "HackMateAI Backend Running"}