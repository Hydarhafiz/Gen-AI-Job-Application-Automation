# In backend/app/api/endpoints/__init__.py
from fastapi import APIRouter
from .users import router as users_router
from .applications import router as applications_router

api_router = APIRouter()
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(applications_router, prefix="/applications", tags=["applications"])