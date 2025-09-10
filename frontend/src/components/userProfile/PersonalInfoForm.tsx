// In frontend/src/components/userProfile/PersonalInfoForm.tsx
import React from 'react';
import type { PersonalInfoFormProps } from '../../interfaces/PersonalInfo';

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label htmlFor="fullName" className="text-gray-600 font-medium mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="phone" className="text-gray-600 font-medium mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
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
          <label htmlFor="linkedinUrl" className="text-gray-600 font-medium mb-1">
            LinkedIn Profile
          </label>
          <input
            type="url"
            id="linkedinUrl"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/johndoe"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="personalWebsiteUrl" className="text-gray-600 font-medium mb-1">
            Portfolio Website
          </label>
          <input
            type="url"
            id="personalWebsiteUrl"
            name="personalWebsiteUrl"
            value={formData.personalWebsiteUrl}
            onChange={handleChange}
            placeholder="https://johndoe.dev"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex flex-col mt-6">
        <label htmlFor="professionalSummary" className="text-gray-600 font-medium mb-1">
          Professional Summary
        </label>
        <textarea
          id="professionalSummary"
          name="professionalSummary"
          value={formData.professionalSummary}
          onChange={handleChange}
          placeholder="Brief summary of your professional background and career objectives..."
          rows={6}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-right text-sm text-gray-400 mt-1">
          {formData.professionalSummary.length}/500 characters
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoForm;