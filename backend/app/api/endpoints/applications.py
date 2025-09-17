# In backend/app/api/endpoints/applications.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
import logging
import json
from typing import Any, Dict
from pydantic import HttpUrl
from datetime import datetime

from ... import schemas, crud
from ...db.database import get_db
from ...core.security import generate_resume_and_cover_letter
from ..endpoints.auth import get_current_user
from ...models.user import User as UserModel
from ...logging_config import api_logger
from ...crud.jobpostings import get_job_posting
from ...schemas.job_postings import JobPosting as JobPostingSchema

router = APIRouter()

def convert_unserializable_objects_to_strings(data: Dict[str, Any]) -> Dict[str, Any]:
    """Recursively converts Pydantic HttpUrl, UUID, and datetime objects to strings."""
    for key, value in data.items():
        if isinstance(value, dict):
            data[key] = convert_unserializable_objects_to_strings(value)
        elif isinstance(value, list):
            data[key] = [
                convert_unserializable_objects_to_strings(item) if isinstance(item, dict) else str(item)
                for item in value
            ]
        elif isinstance(value, (HttpUrl, uuid.UUID, datetime)):
            data[key] = str(value)
    return data

def extract_text_from_nested_dict(data: Dict[str, Any]) -> str:
    """Recursively extracts all string values from a nested dictionary and joins them."""
    extracted_strings = []
    for key, value in data.items():
        if isinstance(value, str):
            extracted_strings.append(value)
        elif isinstance(value, dict):
            extracted_strings.append(extract_text_from_nested_dict(value))
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, str):
                    extracted_strings.append(item)
                elif isinstance(item, dict):
                    extracted_strings.append(extract_text_from_nested_dict(item))
    return "\n\n".join(extracted_strings)

@router.post("/generate", response_model=schemas.ApplicationCreate, status_code=status.HTTP_200_OK)
def generate_application(
    job_posting_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """
    Generates a tailored resume and cover letter for a specific job posting,
    saves it, and returns the generated content.
    """
    # 1. Retrieve the authenticated user's profile with all relationships
    user_with_relations = crud.users.get_user_with_relations(db, user_id=current_user.id)
    if not user_with_relations:
        raise HTTPException(status_code=404, detail="User profile not found.")
        
    # 2. Retrieve the job posting
    job_posting = get_job_posting(db, job_posting_id)
    if not job_posting:
        raise HTTPException(status_code=404, detail="Job posting not found.")

    # 3. Convert SQLAlchemy objects to Pydantic models and then to dictionaries.
    user_data = schemas.User.model_validate(user_with_relations).model_dump()
    job_data = JobPostingSchema.model_validate(job_posting).model_dump()
    
    # Convert any unserializable objects to strings
    user_data = convert_unserializable_objects_to_strings(user_data)
    job_data = convert_unserializable_objects_to_strings(job_data)

    # 4. Generate the resume and cover letter using the data
    try:
        generated_data = generate_resume_and_cover_letter(user_data, job_data)
        
        # 5. Extract text and create the application schema
        resume_text = generated_data.get("resume", "")
        if isinstance(resume_text, dict):
            resume_text = extract_text_from_nested_dict(resume_text)

        cover_letter_text = generated_data.get("cover_letter", "")

        email_template_text = generated_data.get("generated_email_template", "")
        if isinstance(email_template_text, dict):
            email_template_text = extract_text_from_nested_dict(email_template_text)

        application_create_schema = schemas.ApplicationCreate(
            user_id=current_user.id,
            job_posting_id=job_posting.id,
            generated_resume_text=resume_text,
            generated_cover_letter_text=cover_letter_text,
            generated_email_template=email_template_text
        )
        
        # 6. Save to the database
        crud.applications.create_application(
            db=db,
            application=application_create_schema
        )
        
        # 7. Return the generated content to the frontend
        return application_create_schema

    except json.JSONDecodeError as e:
        api_logger.error({"message": "LLM response was not valid JSON", "error": str(e)}, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to parse LLM response. The generated content may be malformed."
        )

    except Exception as e:
        api_logger.error({"message": "Application generation failed with an unexpected error", "error": str(e)}, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )

@router.get("/{job_posting_id}", response_model=schemas.ApplicationInDB)
def get_application_by_job_id(
    job_posting_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """
    Retrieves a generated application for a specific job posting.
    Ensures the application belongs to the authenticated user.
    """
    application = crud.applications.get_application_by_job_id(db, job_posting_id)
    if not application:
        api_logger.warning({"message": "Application not found for job_posting_id", "job_posting_id": job_posting_id})
        raise HTTPException(status_code=404, detail="Application not found for this job posting.")
    
    if application.user_id != current_user.id:
        api_logger.warning({"message": "User not authorized to access application", "application_id": application.id, "user_id": current_user.id})
        raise HTTPException(status_code=403, detail="Not authorized to access this application.")
        
    return application