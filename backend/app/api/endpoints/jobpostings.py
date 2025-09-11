# In backend/app/api/endpoints/jobpostings.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from ... import schemas, crud
from ...db.database import get_db
from ...scraping.linkedin_scraper import LinkedInScraper
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/scrape", response_model=schemas.JobPostingInDB)
async def scrape_job_posting(
    scrape_request: schemas.JobScrapeRequest,
    db: Session = Depends(get_db)
):
    """Scrape job posting from LinkedIn URL"""
    # Validate the URL
    url_str = str(scrape_request.url)
    if "jobs/search" in url_str:
        raise HTTPException(
            status_code=400,
            detail="Please provide a direct link to a job posting, not a search results page."
        )
    
    scraper = LinkedInScraper()
    job_data = await scraper.scrape_job_posting(url_str)
    
    if not job_data:
        raise HTTPException(
            status_code=400,
            detail="Failed to scrape job posting. Please check that the URL is a valid LinkedIn job posting and try again."
        )
    
    # Create job posting in database
    job_posting = schemas.JobPostingCreate(
        user_id=scrape_request.user_id,
        url=scrape_request.url,
        job_title=job_data.get('title', ''),
        company_name=job_data.get('company', ''),
        location=job_data.get('location', ''),
        job_description=job_data.get('description', ''),
        requirements=job_data.get('requirements', '')
    )
    
    return crud.jobpostings.create_job_posting(db=db, job_posting=job_posting)