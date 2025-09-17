import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import ProfilePage from './pages/Profile';
import UserForm from './components/userProfile/UserForm';
import ScraperPage from './pages/ScraperPage';
import LoginPage from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/create" element={<UserForm />} />
        <Route path="/scraper" element={<ScraperPage />} />
      </Routes>
    </Router>
  );
}

export default App;