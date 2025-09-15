# In backend/app/api/endpoints/users.py
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from ... import schemas, crud, models
from ...db.database import get_db

router = APIRouter()

@router.get("/{user_id}/profile", response_model=schemas.User)
def read_user_profile(user_id: uuid.UUID, db: Session = Depends(get_db)):
    db_user = db.query(models.User).options(
        joinedload(models.User.experiences),
        joinedload(models.User.educations),
        joinedload(models.User.projects),
        joinedload(models.User.skills),
        joinedload(models.User.job_postings),
        joinedload(models.User.applications)
    ).filter(models.User.id == user_id).first()

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return db_user