// In frontend/src/pages/ScraperPage.tsx
import React, { useState } from 'react';

const ScraperPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScrape = async () => {
    if (!url) {
      setError('Please enter a LinkedIn job URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Scraping failed: ${response.statusText}`);
      }

      const data = await response.json();
      setScrapedData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LinkedIn Job Scraper</h1>
          <p className="text-gray-600">Paste a LinkedIn job URL to extract the job details</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex space-x-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste LinkedIn job URL here"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleScrape}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Scraping...' : 'Scrape Job'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        {scrapedData && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Scraped Job Data</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Job Title</h3>
                <p className="mt-1 text-lg text-gray-900">{scrapedData.job_title || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Company</h3>
                <p className="mt-1 text-lg text-gray-900">{scrapedData.company || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <div className="mt-1 p-4 bg-gray-50 rounded-md">
                  <p className="text-gray-700 whitespace-pre-wrap">{scrapedData.description || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Source URL</h3>
                <a 
                  href={scrapedData.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-1 text-blue-600 hover:text-blue-800 break-words"
                >
                  {scrapedData.source_url}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScraperPage;