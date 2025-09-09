# In backend/app/api/endpoints/users.py
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from ... import schemas, crud, models
from ...db.database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.UserInDB, status_code=status.HTTP_201_CREATED)
def create_new_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.users.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    return crud.users.create_user(db=db, user=user)

@router.get("/", response_model=list[schemas.UserInDB])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.users.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=schemas.UserInDB)
def read_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    db_user = crud.users.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.get("/{user_id}/profile", response_model=schemas.User)
def read_user_profile(user_id: uuid.UUID, db: Session = Depends(get_db)):
    # This will eagerly load related tables once they are implemented
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
