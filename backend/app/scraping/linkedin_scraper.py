# In backend/app/scraping/linkedin_scraper.py

import markdownify
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import asyncio
from typing import Optional, Dict
import logging

logger = logging.getLogger(__name__)

class LinkedInScraper:
    def __init__(self):
        self.timeout = 60000

    async def scrape_job_posting(self, url: str) -> Optional[Dict]:
        if "jobs/search" in url:
            logger.error("Please provide a direct link to a job posting, not a search results page")
            return None
        
        async with async_playwright() as p:
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
            
            await context.route("**/*.{png,jpg,jpeg,webp}", lambda route: route.abort())
            await context.route("**/*.css", lambda route: route.abort())
            
            page = await context.new_page()
            
            try:
                logger.info(f"Navigating to URL: {url}")
                await page.goto(url, timeout=self.timeout, wait_until='domcontentloaded')
                
                # Wait for the "Show more" button to appear and click it if it exists.
                # This ensures you get the full job description.
                show_more_button = await page.query_selector("button.show-more-less-html__button")
                if show_more_button:
                    await show_more_button.click()
                    await page.wait_for_timeout(1000) # Give it a moment to expand
                
                await page.wait_for_selector('h1, [data-test-job-details-title]', timeout=self.timeout)
                
                content = await page.content()
                soup = BeautifulSoup(content, 'html.parser')

                job_data = {
                    'title': self._extract_title(soup),
                    'company': self._extract_company(soup),
                    'location': self._extract_location(soup),
                    'description': self._extract_description(soup)
                }
                
                await browser.close()
                return job_data
                
            except Exception as e:
                logger.error(f"Error scraping LinkedIn: {str(e)}")
                try:
                    content = await page.content()
                    soup = BeautifulSoup(content, 'html.parser')
                    job_data = {
                        'title': self._extract_title(soup),
                        'company': self._extract_company(soup),
                        'location': self._extract_location(soup),
                        'description': self._extract_description(soup)
                    }
                    await browser.close()
                    return job_data
                except Exception:
                    await browser.close()
                    return None

    def _extract_title(self, soup: BeautifulSoup) -> str:
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
                return elem.get_text(strip=True)
        return ""

    def _extract_company(self, soup: BeautifulSoup) -> str:
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
                return elem.get_text(strip=True)
        return ""

    def _extract_location(self, soup: BeautifulSoup) -> str:
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
                return elem.get_text(strip=True)
        return ""

    def _extract_description(self, soup: BeautifulSoup) -> str:
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
                # Get the inner HTML content of the description element
                html_content = str(elem)
                # Convert HTML to Markdown to preserve formatting
                # The 'strip_tags' parameter is useful for removing unwanted elements like the 'Show less' button.
                # However, it's often easier to first click the button in Playwright, and then just process the final content.
                markdown_text = markdownify.markdownify(html_content, heading_style="ATX", strong_em_symbol="**")
                # Clean up any leftover text like "Show more" or "Show less"
                # This handles cases where the button text is outside the main content block
                markdown_text = markdown_text.replace('Show more', '').replace('Show less', '').strip()
                return markdown_text
        return ""