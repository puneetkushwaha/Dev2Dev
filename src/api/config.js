const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dev2dev-backend.onrender.com';

/**
 * Generates an absolute API URL.
 * Handles cases where VITE_API_URL might be missing the protocol.
 */
export const getApiUrl = (path) => {
    let base = API_BASE_URL.trim();

    // If the URL doesn't start with http, assume https (common in Vercel env vars)
    if (!base.startsWith('http')) {
        base = `https://${base}`;
    }

    // Remove trailing slash from base if present
    base = base.replace(/\/$/, '');

    // Ensure path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${base}${normalizedPath}`;
};

export default getApiUrl;
