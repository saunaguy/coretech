import { jwtDecode } from 'jwt-decode';

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
    localStorage.setItem('token', data.access_token);
    // Also set a cookie so server components can see auth state
    const maxAge = 60 * 60 * 24; // 1 day
    const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `token=${data.access_token}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  // Clear cookie for SSR/server
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `token=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
};

export const getToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('token');
};

export const authenticatedFetch = async (url: string, options?: RequestInit) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'API call failed');
  }

  // Handle empty responses (e.g., 204 No Content)
  if (response.status === 204) {
    return null as any;
  }
  return response.json();
};

export const getUser = () => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};
