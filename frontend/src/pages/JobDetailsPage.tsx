// frontend/src/components/userProfile/JobDetailsPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import { getJobPosting, getApplication } from '../services/api'; 
import type { JobPosting } from '../interfaces/JobPosting';
import type { ApplicationContent } from '../interfaces/ApplicationContent';

const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [application, setApplication] = useState<ApplicationContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        // Attempt to fetch the application data
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

  // ... (rest of the component remains the same)

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
        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
          <button 
            onClick={() => navigate(-1)} 
            className="text-blue-600 hover:underline mb-4 flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i> Back to Profile
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.job_title}</h1>
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
          
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Generated Documents</h3>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="mb-4">
              <h4 className="text-lg font-bold text-gray-800">Tailored Resume</h4>
              <p className="whitespace-pre-wrap text-gray-700 mt-1">
                 {application?.generated_resume_text || 'No generated resume found.'}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800">Tailored Cover Letter</h4>
              <p className="whitespace-pre-wrap text-gray-700 mt-1">
                 {application?.generated_cover_letter_text || 'No generated cover letter found.'}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800">Email Template</h4>
              <p className="whitespace-pre-wrap text-gray-700 mt-1">
                 {application?.generated_email_template || 'No generated email template found.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;