# In backend/app/main.py
from fastapi import FastAPI
from .api.endpoints import api_router

app = FastAPI()

# Add the main API router
app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"Hello": "World"}