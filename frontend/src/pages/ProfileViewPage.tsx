import React, { useState, useEffect } from 'react';
import { getProfile } from '../services/api';
import type { UserProfile } from '../interfaces/UserProfile';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../common/Header';

const ProfileViewPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const userProfile = await getProfile(token);
        setProfile(userProfile);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile. Please log in again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading profile...</p>
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Header />
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">My Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Personal Information</h2>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone_number || 'N/A'}</p>
              <p><strong>Location:</strong> {profile.location || 'N/A'}</p>
              <p>
                <strong>LinkedIn:</strong>{' '}
                {profile.linkedin_url ? (
                  <a href={profile.linkedin_url} className="text-blue-600 hover:underline">
                    {profile.linkedin_url}
                  </a>
                ) : (
                  'N/A'
                )}
              </p>
              <p>
                <strong>Website:</strong>{' '}
                {profile.personal_website_url ? (
                  <a href={profile.personal_website_url} className="text-blue-600 hover:underline">
                    {profile.personal_website_url}
                  </a>
                ) : (
                  'N/A'
                )}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Summary</h2>
              <p className="whitespace-pre-wrap">{profile.professional_summary || 'N/A'}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Experience</h2>
            {profile.experiences.length > 0 ? profile.experiences.map((exp, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                <h3 className="text-lg font-bold">{exp.title} at {exp.company_name}</h3>
                <p className="text-gray-600 text-sm">{exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}</p>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                  {exp.description}
                </p>
              </div>
            )) : <p>No experience listed.</p>}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Education</h2>
            {profile.educations.length > 0 ? profile.educations.map((edu, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                <h3 className="text-lg font-bold">{edu.degree} in {edu.field_of_study}</h3>
                <p className="text-gray-600">{edu.institution_name} ({edu.start_date} - {edu.end_date || 'Present'})</p>
              </div>
            )) : <p>No education listed.</p>}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Skills</h2>
            {profile.skills.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <li key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {skill.name}
                  </li>
                ))}
              </ul>
            ) : <p>No skills listed.</p>}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Projects</h2>
            {profile.projects.length > 0 ? profile.projects.map((project, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                <h3 className="text-lg font-bold">{project.name}</h3>
                <p className="text-gray-600 text-sm">{project.start_date || 'N/A'} - {project.end_date || 'N/A'}</p>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{project.description || 'N/A'}</p>
              </div>
            )) : <p>No projects listed.</p>}
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Scraped Jobs & Documents</h2>
            {profile.job_postings.length > 0 ? profile.job_postings.map((job, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                <h3 className="text-lg font-bold">{job.job_title} at {job.company_name}</h3>
                <p className="text-gray-600 text-sm mb-2">{job.location}</p>
                <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm block mb-4">
                  View Job Posting
                </a>

                <p className="text-gray-700 mt-2">
                  <strong>Job Description:</strong> {job.job_description?.substring(0, 300) || 'No description available.'}...
                </p>
                
                {/* Button to navigate to details page */}
                <Link to={`/jobs/${job.id}`}>
                  <button className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                    View Details & Documents
                  </button>
                </Link>
                
              </div>
            )) : <p>No scraped jobs listed.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewPage;