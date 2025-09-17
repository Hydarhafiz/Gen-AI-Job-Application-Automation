// In frontend/src/components/userProfile/PersonalInfoForm.tsx

import React from 'react';
import type { PersonalInfoFormProps } from '../../interfaces/PersonalInfo';

interface CustomPersonalInfoFormProps extends PersonalInfoFormProps {
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  validationError: string;
}

const PersonalInfoForm: React.FC<CustomPersonalInfoFormProps> = ({
  formData,
  setFormData,
  confirmPassword,
  setConfirmPassword,
  validationError,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-gray-600 font-medium mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-gray-600 font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-gray-600 font-medium mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Choose a strong password"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="confirmPassword" className="text-gray-600 font-medium mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="phone_number" className="text-gray-600 font-medium mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="location" className="text-gray-600 font-medium mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="New York, NY"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="linkedin_url" className="text-gray-600 font-medium mb-1">
            LinkedIn Profile
          </label>
          <input
            type="url"
            id="linkedin_url"
            name="linkedin_url"
            value={formData.linkedin_url || ''} // Fix 1: Provide a fallback empty string for null
            onChange={handleChange}
            placeholder="https://linkedin.com/in/johndoe"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="personal_website_url" className="text-gray-600 font-medium mb-1">
            Portfolio Website
          </label>
          <input
            type="url"
            id="personal_website_url"
            name="personal_website_url"
            value={formData.personal_website_url || ''} // Fix 2: Provide a fallback empty string for null
            onChange={handleChange}
            placeholder="https://johndoe.dev"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex flex-col mt-6">
        <label htmlFor="professional_summary" className="text-gray-600 font-medium mb-1">
          Professional Summary
        </label>
        <textarea
          id="professional_summary"
          name="professional_summary"
          value={formData.professional_summary || ''} // Fix 3: Provide a fallback empty string for null
          onChange={handleChange}
          placeholder="Brief summary of your professional background and career objectives..."
          rows={6}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-right text-sm text-gray-400 mt-1">
          {formData.professional_summary?.length || 0}/500 characters // Fix 4: Use optional chaining to safely access .length
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoForm;