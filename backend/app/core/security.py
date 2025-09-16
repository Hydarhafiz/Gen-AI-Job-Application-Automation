# In backend/app/core/security.py

from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from .config import settings

# This function is a placeholder. You need to implement the actual logic
# using a library like LangChain to interact with an LLM.
def generate_resume_and_cover_letter(user_data: dict, job_data: dict) -> dict:
    """
    Placeholder function to generate a tailored resume and cover letter.
    """
    # Use user_data and job_data to generate the content.
    # The actual implementation would call an external AI model here.
    
    # For now, we return dummy content to make the API work.
    resume_text = (
        f"This is a generated resume for {user_data.get('name', 'User')}, "
        f"tailored for the '{job_data.get('job_title', 'Job')}' position "
        f"at {job_data.get('company_name', 'Company')}."
    )
    
    cover_letter_text = (
        f"This is a generated cover letter for {user_data.get('name', 'User')}, "
        f"applying for the '{job_data.get('job_title', 'Job')}' role "
        f"at {job_data.get('company_name', 'Company')}."
    )
    
    return {
        "resume": resume_text,
        "cover_letter": cover_letter_text
    }

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

def authenticate_user(db, email: str, password: str):
    from ..crud import users
    user = users.get_user_by_email(db, email)
    if not user or not verify_password(password, user.password_hash):
        return False
    return user