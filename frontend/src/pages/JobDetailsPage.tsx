// frontend/src/components/userProfile/JobDetailsPage.tsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../common/Header';

const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  // ⚠️ TODO: Fetch job details based on jobId. 
  // For this example, we'll use placeholder data.
  // In a real application, you'd make an API call here
  // const [job, setJob] = useState<JobPosting | null>(null);
  // useEffect(() => { ... fetch job ... }, [jobId]);

  const job = {
    id: 1,
    job_title: "AI Engineer (Python, Gen AI)",
    company_name: "DHL",
    location: "Cyberjaya, Selangor, Malaysia",
    job_description: "Your IT Future, Delivered AI Engineer (Python, Gen AI) With a global team of 5600+ IT professionals, DHL IT Services connects people and keeps the global economy running by continuously innovating and creating sustainable digital solutions...",
    url: "https://www.linkedin.com/jobs/view/4273057579/",
    // Placeholder for generated documents
    generated_resume: "This is a custom resume tailored for the AI Engineer role at DHL...",
    generated_cover_letter: "This is a custom cover letter tailored for the AI Engineer role at DHL...",
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Job details not found.</p>
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
              <p className="whitespace-pre-wrap text-gray-700 mt-1">{job.generated_resume}</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800">Tailored Cover Letter</h4>
              <p className="whitespace-pre-wrap text-gray-700 mt-1">{job.generated_cover_letter}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;