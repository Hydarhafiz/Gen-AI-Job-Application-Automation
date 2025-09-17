import React, { useState } from 'react';
import { scrapeJob, generateApplication } from '../services/api';
import type { JobPosting } from '../interfaces/JobPosting';
import type { ApplicationContent } from '../interfaces/ApplicationContent';
import Header from '../common/Header';
import { ClipboardIcon } from '@heroicons/react/24/outline';

const ScraperPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<JobPosting | null>(null);
  const [generatedContent, setGeneratedContent] = useState<ApplicationContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>('');

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
    setCopyStatus(''); // Reset copy status on new generation
    
    try {
      const scrapedJob = await scrapeJob(token, url);
      setScrapedData(scrapedJob);
      const generated = await generateApplication(token, scrapedJob.id);
      setGeneratedContent(generated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, documentType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(`${documentType} copied!`);
      setTimeout(() => setCopyStatus(''), 2000); // Clear message after 2 seconds
    } catch (err) {
      setCopyStatus('Failed to copy.');
      console.error('Failed to copy text: ', err);
    }
  };

  const renderDocument = (title: string, content: string | null, documentType: string) => (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200 transition-shadow hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {content && (
          <button
            onClick={() => copyToClipboard(content, documentType)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <ClipboardIcon className="h-4 w-4" />
            <span>Copy</span>
          </button>
        )}
      </div>
      <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
        {content || 'N/A'}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Header /> {/* Add the header here */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Generate Your Application</h1>
          <p className="text-gray-600 text-lg">
            Paste a LinkedIn job URL and let AI create your personalized resume, cover letter, and email template.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8 mb-10 border border-gray-200">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., https://www.linkedin.com/jobs/view/..."
              className="flex-grow px-5 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 transition-colors duration-200"
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Generate Application'}
            </button>
          </div>
          
          {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg font-medium border border-red-200">
              {error}
            </div>
          )}

          {copyStatus && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium text-center transition-opacity duration-300">
              {copyStatus}
            </div>
          )}
        </div>

        {generatedContent && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Your Generated Application Materials</h2>
            {renderDocument("Generated Resume", generatedContent.generated_resume_text, "Resume")}
            {renderDocument("Generated Cover Letter", generatedContent.generated_cover_letter_text, "Cover Letter")}
            {renderDocument("Generated Email Template", generatedContent.generated_email_template, "Email")}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScraperPage;