# In backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import api_router

app = FastAPI()

# Configure CORS middleware
origins = [
    "http://localhost",
    "http://localhost:5173",  # The port your Vite/React frontend runs on
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Add the main API router
app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"Hello": "World"}