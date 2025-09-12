import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const login = async (email: string, password: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  if (data.access_token) {
    localStorage.setItem('token', data.access_token);
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
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