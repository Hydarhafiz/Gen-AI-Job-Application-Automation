# In backend/app/api/endpoints/jobpostings.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from ... import schemas, crud
from ...db.database import get_db
from ...scraping.linkedin_scraper import LinkedInScraper
import logging
from ...logging_config import api_logger  # Import the logger
from ..endpoints.auth import get_current_user # Import the authentication dependency
from ...models.user import User as UserModel

router = APIRouter()

@router.post("/scrape", response_model=schemas.JobPostingInDB)
async def scrape_job_posting(
    scrape_request: schemas.JobScrapeRequest,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user) # Add the authentication dependency
):
    """Scrape job posting from LinkedIn URL for the authenticated user"""
    # Validate the URL
    url_str = str(scrape_request.url)
    if "jobs/search" in url_str:
        api_logger.warning({"message": "Invalid scrape URL provided", "url": url_str})
        raise HTTPException(
            status_code=400,
            detail="Please provide a direct link to a job posting, not a search results page."
        )
    
    scraper = LinkedInScraper()
    try:
        job_data = await scraper.scrape_job_posting(url_str)
    except Exception as e:
        api_logger.error({"message": "Scraping failed due to an exception", "url": url_str, "error": str(e)})
        raise HTTPException(
            status_code=500,
            detail="An internal error occurred while scraping the job posting."
        )
    
    if not job_data:
        api_logger.warning({"message": "Scraping returned no data", "url": url_str})
        raise HTTPException(
            status_code=400,
            detail="Failed to scrape job posting. Please check that the URL is a valid LinkedIn job posting and try again."
        )
    
    # Create job posting in database using the authenticated user's ID
    job_posting = schemas.JobPostingCreate(
        user_id=current_user.id,  # Use the ID from the authenticated user
        url=scrape_request.url,
        job_title=job_data.get('title', ''),
        company_name=job_data.get('company', ''),
        location=job_data.get('location', ''),
        job_description=job_data.get('description', ''),
    )
    
    return crud.jobpostings.create_job_posting(db=db, job_posting=job_posting)

@router.get("/{job_posting_id}", response_model=schemas.JobPostingInDB)
def get_job_posting_by_id(
    job_posting_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Retrieve a single job posting by its ID for the authenticated user."""
    db_job_posting = crud.jobpostings.get_job_posting(db, job_posting_id)
    if not db_job_posting:
        api_logger.warning({"message": "Job posting not found", "job_posting_id": job_posting_id})
        raise HTTPException(status_code=404, detail="Job posting not found")
    
    # Ensure the job posting belongs to the current user for security
    if db_job_posting.user_id != current_user.id:
        api_logger.warning({"message": "User not authorized to access job posting", "job_posting_id": job_posting_id, "user_id": current_user.id})
        raise HTTPException(status_code=403, detail="Not authorized to access this job posting")
    
    return db_job_posting