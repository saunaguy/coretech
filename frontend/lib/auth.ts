import { jwtDecode } from 'jwt-decode';
import { setAuthCookie, clearAuthCookie } from './actions';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  if (data.access_token) {
    // Persist for client-side fetches
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.access_token);
    }
    // Also set a cookie so server components can see auth state
    const maxAge = 60 * 60 * 24; // 1 day
    const secure = typeof window !== 'undefined' && window.location.protocol === 'https:';
    await setAuthCookie(data.access_token, maxAge, secure);
  }
  return data;
};

export const logout = async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
  // Clear cookie for SSR/server
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  await clearAuthCookie(secure);
};

export const register = async (username: string, email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Registration failed with non-JSON response' }));
    throw new Error(errorData.detail || 'Registration failed');
  }

  return response.json();
};

export const getToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('token');
};

export const authenticatedFetch = async (url: string, tokenOverride: string | null = null, options?: RequestInit) => {
  const token = tokenOverride ?? getToken(); // Use override if provided, otherwise get from storage

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'API call failed with non-JSON response' }));
    throw new Error(errorData.detail || 'API call failed');
  }

  if (response.status === 204) {
    return null as any;
  }
  return response.json();
};

export const getUser = (token: string | null = null) => {
  const tokenToDecode = token ?? getToken();
  if (!tokenToDecode) {
    return null;
  }

  try {
    return jwtDecode(tokenToDecode);
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
};
