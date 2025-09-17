// In frontend/src/components/userProfile/UserForm.tsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBriefcase, faGraduationCap, faList, faProjectDiagram, faArrowLeft, faArrowRight, faSave } from '@fortawesome/free-solid-svg-icons';
import PersonalInfoForm from './PersonalInfoForm.tsx';
import ExperienceForm from './ExperienceForm.tsx';
import EducationForm from './EducationForm.tsx';
import SkillsForm from './SkillsForm.tsx';
import ProjectsForm from './ProjectsForm.tsx';
import type { Experience } from '../../interfaces/Experience.ts';
import type { Education } from '../../interfaces/Education.ts';
import type { Skill } from '../../interfaces/Skill.ts';
import type { Project } from '../../interfaces/Project.ts';
import type { PersonalInfo } from '../../interfaces/PersonalInfo.ts';
import { submitProfileData } from '../../services/api.ts';
import { useNavigate } from 'react-router-dom';

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<{
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
  }>({
    personalInfo: {
      name: '',
      email: '',
      password: '',
      phone_number: '',
      location: '',
      linkedin_url: '',
      personal_website_url: '',
      professional_summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);

  const steps = [
    { name: 'Personal Info', icon: faUser },
    { name: 'Experience', icon: faBriefcase },
    { name: 'Education', icon: faGraduationCap },
    { name: 'Skills', icon: faList },
    { name: 'Projects', icon: faProjectDiagram },
  ];

  const handleNext = () => {
    if (currentStep === 0) {
      if (formData.personalInfo.password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        return;
      }
      setValidationError('');
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (formData.personalInfo.password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }
    setValidationError('');
    setLoading(true);

    try {
      await submitProfileData(
        formData.personalInfo,
        formData.experience,
        formData.education,
        formData.skills,
        formData.projects
      );
      alert('Profile created successfully!');
      navigate('/'); // Navigate back to the home page on success
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoForm
            formData={formData.personalInfo}
            setFormData={(data) => setFormData({ ...formData, personalInfo: data })}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            validationError={validationError}
          />
        );
      case 1:
        return (
          <ExperienceForm
            formData={formData.experience}
            setFormData={(data) => setFormData({ ...formData, experience: data })}
          />
        );
      case 2:
        return (
          <EducationForm
            formData={formData.education}
            setFormData={(data) => setFormData({ ...formData, education: data })}
          />
        );
      case 3:
        return (
          <SkillsForm
            formData={formData.skills}
            setFormData={(data) => setFormData({ ...formData, skills: data })}
          />
        );
      case 4:
        return (
          <ProjectsForm
            formData={formData.projects}
            setFormData={(data) => setFormData({ ...formData, projects: data })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="text-4xl text-blue-600 mb-2">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">JAA</h1>
        <p className="text-lg text-gray-600 mt-2 text-center">
          Generate tailored resumes and cover letters from job postings
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Create Your Professional Profile</h2>
        <p className="text-gray-500 mb-8">
          Fill out your information once, and JAA will use it to create tailored applications for every job
        </p>
        
        {/* Navigation Tabs */}
        <div className="flex justify-between items-center border-b border-gray-200 mb-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 flex flex-col items-center p-4 cursor-pointer transition-colors ${
                currentStep === index ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'
              }`}
            >
              <FontAwesomeIcon icon={step.icon} size="lg" />
              <span className="mt-2 text-sm">{step.name}</span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        {renderStep()}
        {validationError && (
          <div className="text-red-500 text-center mt-4">{validationError}</div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={currentStep === 0 || loading}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Previous
          </button>
          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium transition-colors hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
              <FontAwesomeIcon icon={faSave} className="ml-2" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors hover:bg-blue-700"
              disabled={loading}
            >
              Next
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserForm;