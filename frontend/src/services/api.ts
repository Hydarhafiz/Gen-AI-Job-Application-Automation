// In frontend/src/services/apiService.ts
import type { PersonalInfo } from '../interfaces/PersonalInfo';
import type { Experience } from '../interfaces/Experience';
import type { Education } from '../interfaces/Education';
import type { Skill } from '../interfaces/Skill';
import type { Project } from '../interfaces/Project';

const BASE_URL = 'http://localhost:8000/api';

/**
 * Submits all user profile data to the backend.
 * This function handles the multi-step API process:
 * 1. Creates the main user profile.
 * 2. Uses the returned user ID to post the remaining profile sections.
 */
export const submitProfileData = async (
  personalInfo: PersonalInfo,
  experiences: Experience[],
  educations: Education[],
  skills: Skill[],
  projects: Project[]
): Promise<void> => {
  try {
    // Step 1: Create the User Profile
    const userResponse = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(personalInfo),
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      throw new Error(`Failed to create user: ${errorData.detail || userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    const userId = userData.id;
    console.log('User created with ID:', userId);

    // Step 2: Post the remaining profile sections
    const postPromises: any[] = [];

    // Post Experiences
    experiences.forEach(exp => {
      postPromises.push(
        fetch(`${BASE_URL}/users/${userId}/experiences`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(exp),
        })
      );
    });

    // Post Educations
    educations.forEach(edu => {
      postPromises.push(
        fetch(`${BASE_URL}/users/${userId}/educations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(edu),
        })
      );
    });

    // Post Skills
    skills.forEach(skill => {
      postPromises.push(
        fetch(`${BASE_URL}/users/${userId}/skills`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skill),
        })
      );
    });

    // Post Projects
    projects.forEach(project => {
      postPromises.push(
        fetch(`${BASE_URL}/users/${userId}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(project),
        })
      );
    });

    await Promise.all(postPromises);
    console.log('All profile data submitted successfully!');
  } catch (error) {
    console.error('Error submitting profile data:', error);
    throw error;
  }
};