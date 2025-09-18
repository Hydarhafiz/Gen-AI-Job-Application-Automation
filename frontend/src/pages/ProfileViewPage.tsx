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

  // Group skills by category for better organization
  const categorizedSkills: { [key: string]: string[] } = {};
  profile.skills.forEach(skill => {
    const category = skill.category || 'General'; // Default to 'General' if category is missing
    if (!categorizedSkills[category]) {
      categorizedSkills[category] = [];
    }
    categorizedSkills[category].push(skill.name);
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Header />
      <div className="max-w-6xl mx-auto mt-8">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900">My Profile</h1>
            <p className="mt-2 text-lg text-gray-500">Your professional journey at a glance.</p>
          </div>

          {/* Personal Information & Summary Section */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Personal Information</h2>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Phone:</strong> {profile.phone_number || 'N/A'}</p>
                  <p><strong>Location:</strong> {profile.location || 'N/A'}</p>
                  <p>
                    <strong>LinkedIn:</strong>{' '}
                    {profile.linkedin_url ? (
                      <a href={profile.linkedin_url} className="text-blue-600 hover:underline break-words">
                        {profile.linkedin_url}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </p>
                  <p>
                    <strong>Website:</strong>{' '}
                    {profile.personal_website_url ? (
                      <a href={profile.personal_website_url} className="text-blue-600 hover:underline break-words">
                        {profile.personal_website_url}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Professional Summary</h2>
                <p className="whitespace-pre-wrap text-gray-700">{profile.professional_summary || 'N/A'}</p>
              </div>
            </div>
          </div>

          <hr className="my-8 border-t border-gray-200" />

          {/* Experience Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Work Experience</h2>
            {profile.experiences.length > 0 ? profile.experiences.map((exp, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-4">
                <h3 className="text-lg font-bold text-gray-800">{exp.title} <span className="text-gray-500 font-normal">at {exp.company_name}</span></h3>
                <p className="text-gray-500 text-sm">{exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}</p>
                <p className="mt-4 text-gray-700 whitespace-pre-wrap">
                  {exp.description}
                </p>
              </div>
            )) : <p className="text-gray-500">No experience listed.</p>}
          </div>

          <hr className="my-8 border-t border-gray-200" />

          {/* Education Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Education</h2>
            {profile.educations.length > 0 ? profile.educations.map((edu, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-4">
                <h3 className="text-lg font-bold text-gray-800">{edu.degree} in {edu.field_of_study}</h3>
                <p className="text-gray-500">{edu.institution_name} ({edu.start_date} - {edu.end_date || 'Present'})</p>
              </div>
            )) : <p className="text-gray-500">No education listed.</p>}
          </div>

          <hr className="my-8 border-t border-gray-200" />

          {/* Projects Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Projects</h2>
            {profile.projects.length > 0 ? profile.projects.map((project, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-4">
                <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                <p className="text-gray-500 text-sm">{project.start_date || 'N/A'} - {project.end_date || 'N/A'}</p>
                <p className="mt-4 text-gray-700 whitespace-pre-wrap">{project.description || 'N/A'}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      GitHub
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            )) : <p className="text-gray-500">No projects listed.</p>}
          </div>

          <hr className="my-8 border-t border-gray-200" />

          {/* Skills Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Skills</h2>
            {Object.keys(categorizedSkills).length > 0 ? (
              <div className="space-y-6">
                {Object.keys(categorizedSkills).map(category => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">{category}</h3>
                    <ul className="flex flex-wrap gap-2">
                      {categorizedSkills[category].map((skill, index) => (
                        <li key={index} className="bg-gray-200 text-gray-800 text-sm font-medium px-4 py-1.5 rounded-full hover:bg-gray-300 transition-colors">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500">No skills listed.</p>}
          </div>
          
          <hr className="my-8 border-t border-gray-200" />

          {/* Scraped Jobs Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Scraped Jobs & Documents</h2>
            {profile.job_postings.length > 0 ? profile.job_postings.map((job, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-4">
                <h3 className="text-lg font-bold text-gray-800">{job.job_title} at {job.company_name}</h3>
                <p className="text-gray-500 text-sm mb-2">{job.location}</p>
                <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm block mb-4">
                  View Job Posting
                </a>

                <p className="text-gray-700 mt-2 text-sm">
                  <strong>Job Description:</strong> {job.job_description?.substring(0, 300) || 'No description available.'}...
                </p>
                
                <Link to={`/jobs/${job.id}`}>
                  <button className="mt-4 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                    View Details & Documents
                  </button>
                </Link>
              </div>
            )) : <p className="text-gray-500">No scraped jobs listed.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewPage;