import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center rounded-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600">JAA</h1>
      <div className="space-x-4">
        <Link to="/scraper" className="text-gray-700 hover:text-blue-600 font-medium">
          Scraper
        </Link>
        <Link to="/profile/view" className="text-gray-700 hover:text-blue-600 font-medium">
          My Profile
        </Link>
        {/* You can add a logout button here later */}
      </div>
    </nav>
  );
};

export default Header;