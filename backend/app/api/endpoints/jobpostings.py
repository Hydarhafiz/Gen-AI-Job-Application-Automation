# In backend/app/api/endpoints/jobpostings.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from ... import schemas, crud
from ...db.database import get_db
from ...scraping.linkedin_scraper import LinkedInScraper
import logging
from ...logging_config import api_logger  # Import the logger

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