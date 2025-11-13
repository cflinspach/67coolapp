import { browser } from '$app/environment';
import { dev } from '$app/environment';

// Get API base URL from environment variables
// In Amplify, this will be set via environment variables
// For local development, use localhost
// For production, set VITE_API_BASE_URL to your API Gateway URL
// Note: Vite env vars must be available at build time
export const API_BASE_URL = browser 
	? (import.meta.env.VITE_API_BASE_URL || (dev ? 'http://localhost:3001' : 'https://vbi5s1qh91.execute-api.us-east-1.amazonaws.com/prod'))
	: '';

