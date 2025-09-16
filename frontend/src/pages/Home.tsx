// In frontend/src/pages/Home.tsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserPlus, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';

interface HomePageProps {
  onCreateProfileClick: () => void;
  onLoginClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onCreateProfileClick, onLoginClick }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="text-4xl text-blue-600 mb-2">
          {/* Placeholder for the JAA logo */}
          <FontAwesomeIcon icon={faUser} />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">JAA</h1>
        <p className="text-lg text-gray-600 mt-2 text-center">
          Generate tailored resumes and cover letters from job postings
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">Get Started</h2>
        <p className="text-gray-500 text-center mb-8">
          Do you have an existing profile or would you like to create a new one?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="flex flex-col items-center justify-center p-6 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
            onClick={onLoginClick}
          >
            <div className="text-3xl text-green-500 mb-4">
              <FontAwesomeIcon icon={faArrowRightToBracket} />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Login</h3>
            <p className="text-sm text-gray-500 text-center mt-1">
              Access your saved profile data
            </p>
          </div>
          <div
            className="flex flex-col items-center justify-center p-6 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
            onClick={onCreateProfileClick}
          >
            <div className="text-3xl text-blue-500 mb-4">
              <FontAwesomeIcon icon={faUserPlus} />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Create New Profile</h3>
            <p className="text-sm text-gray-500 text-center mt-1">
              Fill in your details for the first time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;