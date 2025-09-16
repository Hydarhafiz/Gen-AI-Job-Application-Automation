# In backend/app/api/endpoints/users.py
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ... import schemas, crud
from ...db.database import get_db
from ..endpoints.auth import get_current_user # <-- Import the dependency
from ...models.user import User as UserModel # <-- Import the User model

router = APIRouter()

@router.get("/profile", response_model=schemas.User)
def read_user_profile(
    current_user: UserModel = Depends(get_current_user), # <-- Inject the dependency
    db: Session = Depends(get_db)
):
    """
    Retrieve the authenticated user's full profile.
    """
    # Use the ID from the authenticated user to fetch the profile
    db_user = crud.users.get_user_with_relations(db, user_id=current_user.id)
    
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return db_user