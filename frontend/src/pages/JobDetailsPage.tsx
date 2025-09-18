// frontend/src/components/userProfile/JobDetailsPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import { getJobPosting, getApplication } from '../services/api';
import type { JobPosting } from '../interfaces/JobPosting';
import type { ApplicationContent } from '../interfaces/ApplicationContent';
import { FaCopy } from 'react-icons/fa'; // Make sure you have react-icons installed

const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [application, setApplication] = useState<ApplicationContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const token = localStorage.getItem('access_token');
      if (!token || !jobId) {
        setError('Authentication token or job ID is missing.');
        setIsLoading(false);
        return;
      }
      
      try {
        const jobData = await getJobPosting(token, jobId);
        setJob(jobData);
        
        const applicationData = await getApplication(token, parseInt(jobId));
        setApplication(applicationData);
        
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load job details. It may not exist or you do not have access.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [jobId]);

  const handleCopy = async (text: string, documentName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStatus(documentName);
      setTimeout(() => setCopiedStatus(null), 2000); // Reset status after 2 seconds
    } catch (err) {
      console.error('Failed to copy text:', err);
      alert('Failed to copy. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">No job details found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Header />
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-200">
          <button 
            onClick={() => navigate(-1)} 
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-6 flex items-center font-medium"
          >
            <i className="fas fa-arrow-left mr-2"></i> Back to Profile
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.job_title}</h1>
          <h2 className="text-xl font-semibold text-gray-600 mb-4">{job.company_name} - {job.location}</h2>
          
          <a 
            href={job.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline text-sm mb-6 inline-block"
          >
            View original job posting
          </a>

          <h3 className="text-xl font-semibold text-gray-700 mb-2 mt-4">Job Description</h3>
          <p className="whitespace-pre-wrap text-gray-700 mb-6">{job.job_description}</p>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Generated Documents</h3>
          
          {/* Resume Panel */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">Tailored Resume</h4>
              <button 
                onClick={() => application?.generated_resume_text && handleCopy(application.generated_resume_text, 'resume')}
                className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                <FaCopy className="mr-1" />
                {copiedStatus === 'resume' ? <span className="text-green-600">Copied!</span> : 'Copy'}
              </button>
            </div>
            <p className="whitespace-pre-wrap text-gray-700 bg-white p-4 rounded border border-gray-300 min-h-[150px] overflow-auto">
              {application?.generated_resume_text || 'No generated resume found.'}
            </p>
          </div>

          {/* Cover Letter Panel */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">Tailored Cover Letter</h4>
              <button 
                onClick={() => application?.generated_cover_letter_text && handleCopy(application.generated_cover_letter_text, 'cover letter')}
                className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                <FaCopy className="mr-1" />
                {copiedStatus === 'cover letter' ? <span className="text-green-600">Copied!</span> : 'Copy'}
              </button>
            </div>
            <p className="whitespace-pre-wrap text-gray-700 bg-white p-4 rounded border border-gray-300 min-h-[150px] overflow-auto">
              {application?.generated_cover_letter_text || 'No generated cover letter found.'}
            </p>
          </div>

          {/* Email Template Panel */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">Email Template</h4>
              <button 
                onClick={() => application?.generated_email_template && handleCopy(application.generated_email_template, 'email')}
                className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                <FaCopy className="mr-1" />
                {copiedStatus === 'email' ? <span className="text-green-600">Copied!</span> : 'Copy'}
              </button>
            </div>
            <p className="whitespace-pre-wrap text-gray-700 bg-white p-4 rounded border border-gray-300 min-h-[150px] overflow-auto">
              {application?.generated_email_template || 'No generated email template found.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;