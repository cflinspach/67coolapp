import { browser } from '$app/environment';
import { dev } from '$app/environment';

// Get API base URL from environment variables
// In Amplify, this will be set via environment variables
// For local development, use localhost
export const API_BASE_URL = browser 
	? (import.meta.env.VITE_API_BASE_URL || (dev ? 'http://localhost:3001' : '/api'))
	: '';

