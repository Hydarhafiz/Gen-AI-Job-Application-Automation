# In backend/app/core/security.py

from datetime import datetime, timedelta
from typing import Optional
import uuid
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import HttpUrl
from .config import settings
import google.generativeai as genai
from datetime import datetime, date
from typing import Optional
import json
from ..logging_config import api_logger

# Configure the Gemini API with your key
genai.configure(api_key=settings.GEMINI_API_KEY)

def generate_resume_and_cover_letter(user_data: dict, job_data: dict) -> dict:
    
    # Define a custom default handler for json.dumps
    def custom_json_serializer(obj):
        if isinstance(obj, date):
            return obj.isoformat()
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, (uuid.UUID, HttpUrl)):
            return str(obj)
        raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")
    
    
    """
    Generates a tailored resume and cover letter using the Gemini API.
    """
    
    prompt = f"""
    You are an expert career assistant. Your task is to generate a tailored resume, cover letter, and a simple email template for a job application. The output must be in JSON format with three keys: "resume", "cover_letter", and "generated_email_template".

    The user's professional profile is:
    <user_profile>
    {json.dumps(user_data, indent=2, default=custom_json_serializer)}
    </user_profile>

    The job posting details are:
    <job_posting>
    {json.dumps(job_data, indent=2, default=custom_json_serializer)}
    </job_posting>

    Instructions:
    - The resume should be a professional summary of the user's skills, experience, and education, tailored to match the keywords and requirements in the job description.
    - The cover letter should be a formal, one-page document expressing the user's interest and highlighting why they are a good fit for the role based on their profile.
    - The email template should be brief and professional, designed to be used when sending the resume and cover letter as attachments.

    Return only the JSON object. Do not include any additional text, markdown, or code blocks outside of the JSON.
    """

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)

        # Sanitize the output by removing markdown code block fences if present
        # This makes the JSON parsing more robust.
        if response.text.startswith("```json") and response.text.endswith("```"):
            json_text = response.text[7:-3].strip()
        else:
            json_text = response.text.strip()
            
        generated_data = json.loads(json_text)

        if "resume" not in generated_data or "cover_letter" not in generated_data:
            raise ValueError("Gemini response did not contain the expected keys.")
        
        return generated_data

    except Exception as e:
        # Log the specific LLM API error with the traceback for better debugging
        api_logger.error(
            {
                "message": "Application generation failed due to LLM error",
                "error": str(e)
            },
            exc_info=True
        )
        raise e

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