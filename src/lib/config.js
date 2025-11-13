import { browser } from '$app/environment';
import { dev } from '$app/environment';

// Get API base URL from environment variables
// In Amplify, this will be set via environment variables
// For local development, use localhost
// For production, use empty string (relative URLs) or set VITE_API_BASE_URL to your API Gateway URL
export const API_BASE_URL = browser 
	? (import.meta.env.VITE_API_BASE_URL || (dev ? 'http://localhost:3001' : ''))
	: '';

