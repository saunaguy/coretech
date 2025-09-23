import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');

export const login = async (email: string, password: string) => {
  // Use relative path so Next.js rewrites proxy to backend
  const response = await fetch(`/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Login failed with non-JSON response' }));
    if (response.status === 403) {
      throw new Error(errorData.detail || 'Account not active. Please wait for admin approval.');
    }
    throw new Error(errorData.detail || 'Login failed');
  }

  const data = await response.json();
  if (data.access_token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.access_token);
    }
    // Cookie is set by backend Set-Cookie via rewrite; no client-side server action needed
  }
  return data;
};

export const logout = async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
  // Ask backend to clear its HttpOnly cookie
  try {
    await fetch(`/api/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {}
};

export const register = async (username: string, email: string, password: string) => {
  // Use relative path so Next.js rewrites proxy to backend
  const response = await fetch(`/api/v1/auth/register`, {
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
  const token = localStorage.getItem('token');
  return token;
};

// Auth-aware fetch with safer 401 handling.
// - Does NOT auto-logout on generic 401s anymore.
// - Auto-logout only for verify-token or when explicitly requested via options.autoLogoutOn401 = true
export const authenticatedFetch = async (url: string, arg2?: any, arg3?: any) => {
  let tokenOverride: string | null = null;
  let options: RequestInit | undefined = undefined;

  // Determine if arg2 is tokenOverride or options
  if (typeof arg2 === 'string' || arg2 === null) {
    tokenOverride = arg2;
    options = arg3;
  } else if (typeof arg2 === 'object' && arg2 !== null) {
    // If arg2 is an object, assume it's the options object and arg3 is undefined
    options = arg2;
    tokenOverride = arg3; // This would be undefined, which is fine for tokenOverride
  }

  // Ensure options is an object if it's still undefined
  if (options === undefined) {
    options = {};
  }

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
    credentials: options?.credentials ?? 'same-origin',
  });

  if (response.status === 401) {
    // Only auto-logout if this is the token verification endpoint or explicitly requested
    const isVerifyEndpoint = typeof url === 'string' && url.includes('/api/v1/auth/verify-token');
    const wantsAutoLogout = !!(options as any)?.autoLogoutOn401;
    if (isVerifyEndpoint || wantsAutoLogout) {
      try { await logout(); } catch {}
      try { if (typeof window !== 'undefined') window.location.href = '/auto-logout'; } catch {}
    }
    // Propagate error to caller for contextual handling
    throw new Error('Unauthorized');
  }
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
