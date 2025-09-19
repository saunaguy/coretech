'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, logout as apiLogout, getUser, register as apiRegister, authenticatedFetch } from '@/lib/auth'

interface AuthContextType {
  isAuthenticated: boolean
  user: any
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  register: (username: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Use relative path to avoid CORS and rely on Next.js rewrites
          await authenticatedFetch(`/api/v1/auth/verify-token`, token);
          const currentUser = getUser(token);
          if (currentUser) {
            setUser(currentUser);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, [])

  const login = async (username: string, password: string) => {
    const data = await apiLogin(username, password)
    if (data && data.access_token) {
      const currentUser = getUser(data.access_token)
      setUser(currentUser)
    } else {
      setUser(null);
    }
  }

  const logout = () => {
    apiLogout()
    setUser(null)
  }

  const register = async (username: string, email: string, password: string) => {
    await apiRegister(username, email, password);
  }

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
