# In backend/app/scraping/linkedin_scraper.py
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import asyncio
import re
from typing import Optional, Dict
import logging

logger = logging.getLogger(__name__)

class LinkedInScraper:
    def __init__(self):
        self.timeout = 60000  # Increase timeout to 60 seconds

    async def scrape_job_posting(self, url: str) -> Optional[Dict]:
        """Scrape LinkedIn job posting details"""
        # Check if this is a search results page or individual job page
        if "jobs/search" in url:
            logger.error("Please provide a direct link to a job posting, not a search results page")
            return None
            
        async with async_playwright() as p:
            # Launch browser with additional arguments to appear more like a real user
            browser = await p.chromium.launch(
                headless=True,
                args=[
                    '--disable-blink-features=AutomationControlled',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            )
            
            # Create a new context with a realistic user agent
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                viewport={'width': 1920, 'height': 1080},
                extra_http_headers={
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                }
            )
            
            # Block images and CSS to speed up loading
            await context.route("**/*.{png,jpg,jpeg,webp}", lambda route: route.abort())
            await context.route("**/*.css", lambda route: route.abort())
            
            page = await context.new_page()
            
            try:
                logger.info(f"Navigating to URL: {url}")
                await page.goto(url, timeout=self.timeout, wait_until='domcontentloaded')
                
                # Wait for the job title to appear as an indicator that the page has loaded
                await page.wait_for_selector('h1, [data-test-job-details-title]', timeout=self.timeout)
                
                # Try multiple selectors for job description
                description_selectors = [
                    '.jobs-description__content',
                    '.description__text',
                    '[data-test-job-details-description]',
                    '.jobs-box__html-content',
                    '.show-more-less-html__markup'
                ]
                
                description_found = False
                for selector in description_selectors:
                    if await page.query_selector(selector):
                        description_found = True
                        break
                
                if not description_found:
                    logger.warning("No description selector found, trying to extract from page content")
                
                # Get page content
                content = await page.content()
                soup = BeautifulSoup(content, 'html.parser')
                
                # Extract job details with multiple fallback selectors
                job_data = {
                    'title': self._extract_title(soup),
                    'company': self._extract_company(soup),
                    'location': self._extract_location(soup),
                    'description': self._extract_description(soup),
                    'requirements': self._extract_requirements(soup)
                }
                
                await browser.close()
                return job_data
                
            except Exception as e:
                logger.error(f"Error scraping LinkedIn: {str(e)}")
                # Try to get at least some content even if there's an error
                try:
                    content = await page.content()
                    soup = BeautifulSoup(content, 'html.parser')
                    job_data = {
                        'title': self._extract_title(soup),
                        'company': self._extract_company(soup),
                        'location': self._extract_location(soup),
                        'description': self._extract_description(soup),
                        'requirements': self._extract_requirements(soup)
                    }
                    await browser.close()
                    return job_data
                except:
                    await browser.close()
                    return None

    def _extract_title(self, soup: BeautifulSoup) -> str:
        # Try multiple selectors for job title
        selectors = [
            'h1',
            '[data-test-job-details-title]',
            '.job-title',
            '.top-card-layout__title',
            '.jobs-details-top-card__job-title'
        ]
        
        for selector in selectors:
            elem = soup.select_one(selector)
            if elem:
                return elem.get_text().strip()
        return ""

    def _extract_company(self, soup: BeautifulSoup) -> str:
        # Try multiple selectors for company name
        selectors = [
            '[data-test-job-details-company]',
            '.employer-name',
            '.topcard__org-name-link',
            '.jobs-details-top-card__company-url',
            '.jobs-company-name'
        ]
        
        for selector in selectors:
            elem = soup.select_one(selector)
            if elem:
                return elem.get_text().strip()
        return ""

    def _extract_location(self, soup: BeautifulSoup) -> str:
        # Try multiple selectors for location
        selectors = [
            '[data-test-job-details-location]',
            '.location',
            '.topcard__flavor--bullet',
            '.jobs-details-top-card__exact-location',
            '.jobs-unified-top-card__bullet'
        ]
        
        for selector in selectors:
            elem = soup.select_one(selector)
            if elem:
                return elem.get_text().strip()
        return ""

    def _extract_description(self, soup: BeautifulSoup) -> str:
        # Try multiple selectors for job description
        selectors = [
            '.jobs-description__content',
            '.description__text',
            '[data-test-job-details-description]',
            '.jobs-box__html-content',
            '.show-more-less-html__markup'
        ]
        
        for selector in selectors:
            elem = soup.select_one(selector)
            if elem:
                return elem.get_text().strip()
        return ""

    def _extract_requirements(self, soup: BeautifulSoup) -> str:
        # Look for requirements section with multiple approaches
        requirements = []
        
        # Method 1: Look for specific headings
        headings = soup.find_all(['h2', 'h3', 'h4'])
        requirement_keywords = ['requirement', 'qualification', 'skill', 'experience', 'what you', 'you have', 'must have']
        
        for heading in headings:
            text = heading.get_text().lower()
            if any(keyword in text for keyword in requirement_keywords):
                # Get content after the heading
                next_elem = heading.find_next()
                while next_elem and next_elem.name not in ['h1', 'h2', 'h3', 'h4']:
                    if next_elem.name in ['p', 'li', 'ul', 'ol']:
                        requirements.append(next_elem.get_text().strip())
                    next_elem = next_elem.find_next()
        
        # Method 2: Look for lists that might contain requirements
        lists = soup.find_all(['ul', 'ol'])
        for lst in lists:
            list_text = lst.get_text().lower()
            if any(keyword in list_text for keyword in requirement_keywords):
                list_items = lst.find_all('li')
                for item in list_items:
                    requirements.append(item.get_text().strip())
        
        return "\n".join(requirements) if requirements else ""