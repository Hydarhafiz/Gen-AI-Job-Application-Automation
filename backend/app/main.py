# In backend/app/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import api_router
from .logging_config import api_logger  # Import the logger
import time

app = FastAPI()

# Configure CORS middleware
origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom middleware for logging requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        api_logger.info(
            {
                "message": "API Request Handled",
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "process_time_ms": int(process_time * 1000)
            }
        )
        return response
    except Exception as e:
        process_time = time.time() - start_time
        api_logger.error(
            {
                "message": "API Request Failed",
                "method": request.method,
                "path": request.url.path,
                "error": str(e),
                "process_time_ms": int(process_time * 1000)
            }
        )
        raise  # Re-raise the exception to be handled by FastAPI's exception handlers

# Add the main API router
app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"Hello": "World"}