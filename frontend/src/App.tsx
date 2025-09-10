// In frontend/src/App.tsx
import React, { useState } from 'react';
import './index.css';
import HomePage from './pages/Home';
import ProfilePage from './pages/Profile';
import UserForm from './components/userProfile/UserForm';


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [profileOption, setProfileOption] = useState(''); // 'manual' or 'upload'

  const handleCreateProfileClick = () => {
    setCurrentPage('profile');
  };

  const handleBackClick = () => {
    setCurrentPage('home');
  };

  const handleStartManualCreation = () => {
    setProfileOption('manual');
  };

  return (
    <div>
      {currentPage === 'home' && <HomePage onCreateProfileClick={handleCreateProfileClick} />}
      {currentPage === 'profile' && profileOption === '' && (
        <ProfilePage onBackClick={handleBackClick} onStartManualCreation={handleStartManualCreation} />
      )}
      {currentPage === 'profile' && profileOption === 'manual' && <UserForm />}
    </div>
  );
}

export default App;