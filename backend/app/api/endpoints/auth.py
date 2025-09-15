# In backend/app/api/endpoints/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from ... import schemas, crud
from ...db.database import get_db
from ...core.security import create_access_token, authenticate_user
from ...core.config import settings
import logging
from ...logging_config import api_logger

router = APIRouter()

@router.post("/signup", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def signup(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.users.get_user_by_email(db, email=user_data.email)
    if db_user:
        api_logger.warning({"message": "Attempted signup with an existing email", "email": user_data.email})
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    return crud.users.create_user(db=db, user=user_data)

@router.post("/token", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        api_logger.warning({"message": "Failed login attempt", "email": form_data.username})
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}