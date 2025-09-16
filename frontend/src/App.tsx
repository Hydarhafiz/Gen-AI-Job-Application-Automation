// In frontend/src/App.tsx

import React, { useState } from 'react';
import './index.css';
import HomePage from './pages/Home';
import ProfilePage from './pages/Profile';
import UserForm from './components/userProfile/UserForm';
import ScraperPage from './pages/ScraperPage';
import LoginPage from './pages/Login';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [profileOption, setProfileOption] = useState('');

  const handleCreateProfileClick = () => {
    setCurrentPage('profile');
  };

  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const handleBackClick = () => {
    setCurrentPage('home');
  };

  const handleStartManualCreation = () => {
    setProfileOption('manual');
  };

  const handleSuccessfulSignup = () => {
    setCurrentPage('home');
  };

  const onSuccessfulLogin = () => {
    setCurrentPage('scraper'); // For now, let's navigate to the scraper page
  };

  return (
    <div>
      {currentPage === 'home' && (
        <HomePage onCreateProfileClick={handleCreateProfileClick} onLoginClick={handleLoginClick} />
      )}
      {currentPage === 'profile' && profileOption === '' && (
        <ProfilePage onBackClick={handleBackClick} onStartManualCreation={handleStartManualCreation} />
      )}
      {currentPage === 'profile' && profileOption === 'manual' && (
        <UserForm onSuccess={handleSuccessfulSignup} />
      )}
      {currentPage === 'login' && <LoginPage onSuccessfulLogin={onSuccessfulLogin} />}
      {currentPage === 'scraper' && <ScraperPage />}
    </div>
  );
}

export default App;