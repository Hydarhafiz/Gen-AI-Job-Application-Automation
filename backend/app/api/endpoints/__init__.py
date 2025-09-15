# In backend/app/api/endpoints/__init__.py
from fastapi import APIRouter
from .auth import router as auth_router
from .users import router as users_router
from .applications import router as applications_router
from .jobpostings import router as jobpostings_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(applications_router, prefix="/applications", tags=["applications"])
api_router.include_router(jobpostings_router, prefix="/jobpostings", tags=["jobpostings"])