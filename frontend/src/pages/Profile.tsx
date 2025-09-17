import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFileUpload, faKeyboard } from '@fortawesome/free-solid-svg-icons';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page in history
  };

  const handleStartManualCreation = () => {
    navigate('/profile/create'); // Navigate to the user form page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="text-4xl text-blue-600 mb-2">
          <FontAwesomeIcon icon={faKeyboard} />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">JAA</h1>
        <p className="text-lg text-gray-600 mt-2 text-center">
          Generate tailored resumes and cover letters from job postings
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-xl relative">
        <button
          onClick={handleBackClick}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-2">Create Your Profile</h2>
        <p className="text-gray-500 text-center mb-8">
          Fill out your professional information to generate tailored applications
        </p>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center p-6 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <div className="text-3xl text-blue-500 mb-4">
              <FontAwesomeIcon icon={faFileUpload} />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Upload Resume</h3>
            <p className="text-sm text-gray-500 text-center mt-1">
              Let our AI fill out the details for you
            </p>
            <button className="mt-4 w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
              Upload Resume
            </button>
          </div>
          <div className="flex flex-col items-center p-6 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <div className="text-3xl text-green-500 mb-4">
              <FontAwesomeIcon icon={faKeyboard} />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Fill Out Manually</h3>
            <p className="text-sm text-gray-500 text-center mt-1">
              Enter your details step-by-step
            </p>
            <button
              onClick={handleStartManualCreation}
              className="mt-4 w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors"
            >
              <FontAwesomeIcon icon={faKeyboard} className="mr-2" />
              Start Creating Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;