// In frontend/src/utils/token.ts

import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string; // The user ID is stored in the 'sub' (subject) claim
  exp: number; // The expiration timestamp
}

/**
 * Decodes a JWT token to extract the user ID.
 * @param token The JWT access token string.
 * @returns The user's ID (a string) or null if the token is invalid or missing.
 */
export const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    // The 'sub' claim in our token holds the user ID.
    return decoded.sub;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};