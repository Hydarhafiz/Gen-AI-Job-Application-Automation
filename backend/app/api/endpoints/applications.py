# In backend/app/api/endpoints/applications.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
import logging

from ... import schemas, crud
from ...db.database import get_db
from ...core.security import generate_resume_and_cover_letter
from ..endpoints.auth import get_current_user
from ...models.user import User as UserModel
from ...logging_config import api_logger
from ...crud.jobpostings import get_job_posting
from ...schemas.job_postings import JobPosting as JobPostingSchema # Import the schema

router = APIRouter()

@router.post("/generate", status_code=status.HTTP_200_OK)
def generate_application(
    job_posting_id: int, # Change the type from uuid.UUID to int
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """
    Generates a tailored resume and cover letter for a specific job posting
    based on the authenticated user's profile.
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

    # 4. Generate the resume and cover letter using the data
    try:
        generated_data = generate_resume_and_cover_letter(user_data, job_data)
        
        # 5. Save the generated data to the database
        created_application = crud.applications.create_application(
            db=db,
            user_id=current_user.id,
            job_posting_id=job_posting.id,
            generated_resume_text=generated_data["resume"],
            generated_cover_letter_text=generated_data["cover_letter"]
        )
        return {"message": "Application generated and saved successfully."}

    except Exception as e:
        api_logger.error({"message": "Application generation failed", "error": str(e)})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate application materials."
        )