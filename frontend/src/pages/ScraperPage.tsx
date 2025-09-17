// In frontend/src/pages/ScraperPage.tsx

import React, { useState } from 'react';
import { scrapeJob, generateApplication } from '../services/api';
import type { JobPosting } from '../interfaces/JobPosting'; // You might need to create this interface
import type { ApplicationContent } from '../interfaces/ApplicationContent';

const ScraperPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<JobPosting | null>(null);
  const [generatedContent, setGeneratedContent] = useState<ApplicationContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!url) {
      setError('Please enter a LinkedIn job URL');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in to use this feature.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setScrapedData(null);
    setGeneratedContent(null);
    
    try {
      // Step 1: Scrape the job posting
      const scrapedJob = await scrapeJob(token, url);
      setScrapedData(scrapedJob);

      // Step 2: Trigger the application generation
      const generated = await generateApplication(token, scrapedJob.id);
      setGeneratedContent(generated);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = (title: string, content: string | null) => (
    <div className="bg-white shadow rounded-lg p-6 mb-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="mt-1 p-4 bg-gray-50 rounded-md">
        <p className="text-gray-700 whitespace-pre-wrap">{content || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Your Application</h1>
          <p className="text-gray-600">Paste a LinkedIn job URL to automatically generate your application materials.</p>
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
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Generate Application'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        {generatedContent && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Application Materials</h2>
            {renderContent("Generated Resume", generatedContent.generated_resume_text)}
            {renderContent("Generated Cover Letter", generatedContent.generated_cover_letter_text)}
            {renderContent("Generated Email Template", generatedContent.generated_email_template)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScraperPage;