// In frontend/src/services/apiService.ts

import type { PersonalInfo } from '../interfaces/PersonalInfo';
import type { Experience } from '../interfaces/Experience';
import type { Education } from '../interfaces/Education';
import type { Skill } from '../interfaces/Skill';
import type { Project } from '../interfaces/Project';

const BASE_URL = 'http://localhost:8000/api';

/**
 * Submits all user profile data to the backend via the signup endpoint.
 * This function handles the entire signup process in a single API call.
 */
export const submitProfileData = async (
  personalInfo: PersonalInfo,
  experiences: Experience[],
  educations: Education[],
  skills: Skill[],
  projects: Project[]
): Promise<void> => {
  try {
    const signupData = {
      ...personalInfo,
      experiences,
      educations,
      skills,
      projects,
    };

    // Correctly send data to the signup endpoint
    const userResponse = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      throw new Error(`Failed to create user: ${errorData.detail || userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    console.log('User and full profile created with ID:', userData.id);
    alert('Profile created successfully!');
  } catch (error) {
    console.error('Error submitting profile data:', error);
    alert('An error occurred. Please try again.');
    throw error;
  }
};

/**
 * Authenticates a user by sending a request to the backend's token endpoint.
 * @param email The user's email.
 * @param password The user's password.
 * @returns A Promise that resolves with the access token string.
 */
export const loginUser = async (email: string, password: string): Promise<string> => {
  const loginData = new URLSearchParams();
  loginData.append('grant_type', 'password');
  loginData.append('username', email);
  loginData.append('password', password);

  const response = await fetch(`${BASE_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: loginData.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed.');
  }

  const data = await response.json();
  return data.access_token;
};