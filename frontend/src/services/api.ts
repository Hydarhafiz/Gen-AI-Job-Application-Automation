import type { PersonalInfo } from '../interfaces/PersonalInfo';
import type { Experience } from '../interfaces/Experience';
import type { Education } from '../interfaces/Education';
import type { Skill } from '../interfaces/Skill';
import type { Project } from '../interfaces/Project';
import type { UserProfile } from '../interfaces/UserProfile';
import type { JobPosting } from '../interfaces/JobPosting';
import type { ApplicationContent } from '../interfaces/ApplicationContent';

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

/**
 * Retrieves the full user profile for the authenticated user.
 * @param token The access token for authentication.
 * @returns A Promise that resolves with the user's profile data.
 */
export const getProfile = async (token: string): Promise<UserProfile> => {
    const response = await fetch(`${BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch user profile.');
    }
    
    return response.json();
};

/**
 * Scrapes a job posting from a LinkedIn URL.
 * @param token The access token for authentication.
 * @param url The LinkedIn job posting URL.
 * @returns A Promise that resolves with the scraped job data.
 */
export const scrapeJob = async (token: string, url: string): Promise<JobPosting> => {
  const response = await fetch(`${BASE_URL}/jobpostings/scrape`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Scraping failed.');
  }

  const data = await response.json();
  return data;
};

/**
 * Triggers the backend to generate a tailored application.
 * @param token The access token for authentication.
 * @param jobPostingId The ID of the job posting to generate an application for.
 * @returns A Promise that resolves with the generated application content.
 */
export const generateApplication = async (token: string, jobPostingId: number): Promise<ApplicationContent> => {
    const response = await fetch(`${BASE_URL}/applications/generate?job_posting_id=${jobPostingId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Application generation failed.');
    }

    const data = await response.json();
    return data;
};