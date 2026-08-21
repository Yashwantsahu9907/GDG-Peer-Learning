// Centralized Environment & API Configuration for Render & Local Environments

const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_SERVER_URL || 'http://localhost:5000/api';

// Remove trailing slashes
const cleanUrl = rawApiUrl.replace(/\/+$/, '');

// Ensure API_URL points to the /api endpoint
export const API_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

// Base server URL without /api prefix (for Socket.IO and backend root calls)
export const SERVER_URL = API_URL.replace(/\/api$/, '');

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'mock-client-id';
